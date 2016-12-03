const {createReadStream, createWriteStream} = require('fs');

// open db connection
const mongoose = require('mongoose');
const db = mongoose.connect("mongodb://localhost/mydb");

const readDictionaryStream =  createReadStream("app/fixtures/session_dictionary.txt");
const readSessionStream = createReadStream("app/fixtures/airbnb_session_data.txt");
// const readNodeJsEventLoopStream =  createReadStream("app/fixtures/nodejs_event_loop.txt");
const readNodeJsEventLoopStream =  createReadStream("app/fixtures/nodejs-event-loop-explanations.md");
const writeLogStream = createWriteStream("app/log/log.txt");
// const readSessionStream = createReadStream("app/fixtures/session_data.txt");

let lines_ok=0, lines_ko=0;

// Initialize database as soon as possible
process.nextTick(() => {
    mongoose.connection.once('connected', () => {
        // drop db to start in a clean state
        console.log('Database intialized');
        mongoose.connection.db.dropDatabase();
    });
})


// Read and save nodejs event loop explanation file
readNodeJsEventLoopStream.on("data", (data) => {
    const fileDataSchema = mongoose.Schema({
        _id: String,
        value: String
    });
    const FileData = mongoose.model("FileData", fileDataSchema);
    const f = new FileData();
    f.value = data;
    f._id = "nodejs_event_loop";
    f.save( (err) => {
        if (err){
            console.log("ERR: "+err)        
        }
        else
            console.log("SUCCESS - NodeJs Event Loop explanations added");
    });
});

// Read dictionary to initialize collection
readDictionaryStream.on("data", (data) => {
    data = data.toString();
    console.log("read dictionary");
    const dictionary = data.split('|');
    const rawDataSchemaJson = {};
    dictionary.map( (word) => {
        rawDataSchemaJson[word] = {
            type: String,
            required: true,
        };
    }); 
    
    // to ensure the line is relevant (required) and unique (index-uniaue)
    rawDataSchemaJson["id_session"] = {
        type: String,
        required: true,
        index: { unique: true }
    };
    rawDataSchemaJson["device"] = {
        type: String,
        required: true
    };

    // initialize RawData schema and model
    const rawDataSchema = mongoose.Schema(rawDataSchemaJson);
    const RawData = mongoose.model("RawData", rawDataSchema);

    // to handle first and last line of stream edge cases (no full line)
    let n_fields;
    let firstLine, lastLine;

    readSessionStream.on("data", (data) => {
        data = data.toString();
        lines = data.split('\n');
        const rawDataJson = {}
        let first = true;
        let end = false;
        lines.map( (line) => {
            // to handle first and last line of stream edge cases (no full line)
            n_fields = n_fields || line.split('|').length; 
            if (line.split('|').length !== n_fields ){
                // first line uncomplete case
                if (first)
                    line = lastLine + line;
                // last line uncomplete case
                else {
                    lastLine = line;
                    end = true;
                }
            }
            // after first line (first line uncomplete case)
            first = false;

            var fields = line.split('|');
            for (var i=0; i< dictionary.length; i++){
                rawDataJson[dictionary[i]] = fields[i];
            }
            let r =  new RawData(rawDataJson)
            // to ensure line is relevant
            if (r.id_session && !end){
                r.device = r.dim_device_app_combo.replace(/(.*) -.*/g,'$1');
                r.save( (err) => {
                    if (err){
                        // writeLogStream.write("[error] id_session: "+r.id_session+" err: "+err.message+"\n");
                        lines_ko++;
                    }
                    else
                        lines_ok++;
                });
                // c++;
            }                
        });
    });

    readSessionStream.on("end", () => {
        RawData.count( (err, r) => {
            console.log("the end: "+r);
            console.log("verif lines ok: "+lines_ok);
            console.log("verif: lines ko: "+lines_ko);
        });

        // remove first document that contains field names
        RawData.find({device: "dim_device_app_combo"}).remove().exec();

        // Aggregation functions to extract relevant data
        const clientPerUserDeviceMapReduce = {
            map: function() { 
                emit(this.device, 1);
            },
            reduce: function(device, n) { 
                return Array.sum(n);
            },
            scope: {
                total: lines_ok
            },
            finalize: function(key, reduced_value) {
                return {
                    name: key,
                    value:""+((reduced_value / total) * 100).toFixed(2)+"%" // precentage
                };
            },
            out: 'clients_per_user_device'
        };

        RawData.mapReduce(clientPerUserDeviceMapReduce, (err, data, stats) => { 
            if (err)
                console.log(err)
            else if (stats)
                console.log('"Clients per device" map reduce took %d ms', stats.processtime)
        });

        const clientPerUserAgentMapReduce = {
            map: function() { 
                emit(this.dim_user_agent, 1)
            },
            reduce: function(device, n) {
                return Array.sum(n);
            },
            finalize: function(key, reduced_value) {
                return {
                    name: key,
                    value: reduced_value
                };
            },
            out: 'clients_per_user_agent'
        };

        RawData.mapReduce(clientPerUserAgentMapReduce, (err, data, stats) => { 
            if (err)
                console.log(err)
            else if (stats)
                console.log('"Clients per user-agent" map reduce took %d ms', stats.processtime)
        });

        const UserSessionDurationMapReduce = {
            map: function() {
                // calculate session duration
                var duration = new ISODate(this.ts_max) - new ISODate(this.ts_min);
                emit(this.device, duration)
            },
            reduce: function(device, n) {
                // reduce to sum of duration per device
                return Array.sum(n);
            },
            finalize: function(key, reduced_value) {
                var days = Math.floor( reduced_value / ( 3600 * 24 * 1000) );
                days = days > 1 ? days+"d" : "";   
                var hours = new Date(reduced_value).getHours();
                hours = hours ? hours + "h" : "";
                var minutes = new Date(reduced_value).getMinutes(); 
                minutes = minutes ?  minutes+ "m" : ""; 
                var seconds = new Date(reduced_value).getSeconds();
                seconds = seconds ? seconds + "s" : "";
                var duration = days + hours + minutes + seconds;
                return {
                    name: key,
                    value: duration
                };
            },
            out: 'duration_per_user_device'
        };

        RawData.mapReduce(UserSessionDurationMapReduce, (err, data, stats) => { 
            if (err)
                console.log(err)
            else if (stats)
                console.log('"Duration per device" map reduce took %d ms', stats.processtime)
        });

        // close db connection and writeStream
        mongoose.connection.close();
        writeLogStream.end();    
    });
});