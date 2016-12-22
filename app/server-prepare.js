require('babel/register');
const fs = require('fs');

// model FileData
const FileData = require('./models/FileData.js');

// Initialize database as soon as possible
const mongoose = require('./infra/db-manager');

mongoose.connection.once('connected', () => {
    // drop db to start in a clean state
    console.log('Database intialized');
    mongoose.connection.db.dropDatabase();

    // ----------------------
    // Start operations (main)
    // ----------------------
    let promiseIndex = 1;
    console.log('[promise '+promiseIndex+'] Addition of nodejs event loop data');
    readNodeJsEventLoopFilePromise()
        .then((id) => {
            promiseIndex++;
            console.log('[promise '+promiseIndex+'] Addition of readme data - after '+id+' added');
            return readReadMeFilePromise();
        })
        .then( () => {
            promiseIndex++;
            console.log('[promise '+promiseIndex+'] Extraction of dictionary');
            return readDictionaryPromise();
        })
        .then( (req) => {
            promiseIndex++;
            console.log('[promise '+promiseIndex+'] Extraction of session data - after '+req.previousPhase);
            return readSessionPromise(req);
        })
        .then( (req) => {
            promiseIndex++;
            console.log('[promise '+promiseIndex+'] Aggregation of session data  - after '+req.previousPhase);
            return sessionDataAggregationPromise(req);
        })
        .then( (req) => {  
            promiseIndex++;          
            console.log('[last promise] after '+req+' - the end');
            mongoose.connection.close();            
        }).catch( (err) => {
            console.log(err);
        });        
});

// --------
// contexts
// --------

const contextNodeJsEventLoopFile = {
    id: 'nodejs_event_loop',
    path: 'app/fixtures/nodejs-event-loop-explanations.md'
};

const contextReadMeFile = {
    id: 'readme',
    path: 'README.md'
};

const contextDictionaryFile = {
    id: 'dictionary',
    path: 'app/fixtures/session_dictionary.txt'
};

const contextSessionFile = {
    id: 'session_data',
    path: 'app/fixtures/airbnb_session_data.txt'
};

// -----------------------------------
// Aggregation (map reduce) parameters
// -----------------------------------

const clientPerUserDeviceMapReduce = {
    map: function() { 
        emit(this.device, 1);
    },
    reduce: function(device, n) { 
        return Array.sum(n);
    },
    // scope: {
    //     total: lines_ok
    // },
    finalize: function(key, reduced_value) {
        return {
            name: key,
            value:""+((reduced_value / total) * 100).toFixed(2)+"%" // precentage
        };
    },
    out: 'clients_per_user_device'
};

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
            value: duration // _d_h_m_s format
        };
    },
    out: 'duration_per_user_device'
};


//--------
//promises
//--------

const sessionDataAggregationPromise = (req) => {
    return new Promise( (resolve, reject) => {
        const RawData = req.model;

        // remove first document that contains field names
        RawData.find({device: "dim_device_app_combo"}).remove().exec();

        // Aggregation functions to extract relevant data        

        // scope added to map-reduce with value stored in a passed arguement
        clientPerUserDeviceMapReduce.scope = {
            total: req.lines_ok
        };
        RawData.mapReduce(clientPerUserDeviceMapReduce, (err, data, stats) => { 
            if (err)
                reject(err) 
            else if (stats){
                console.log('\t"Clients per device" map reduce took %d ms', stats.processtime);
                done();
            }
        });

        RawData.mapReduce(clientPerUserAgentMapReduce, (err, data, stats) => { 
            if (err)
                reject(err)
            else if (stats){
                console.log('\t"Clients per user-agent" map reduce took %d ms', stats.processtime) 
                done();
            }
        });

        RawData.mapReduce(UserSessionDurationMapReduce, (err, data, stats) => { 
            if (err)
                reject(err)
            else if (stats){
                console.log('\t"Duration per device" map reduce took %d ms', stats.processtime)
                done();
            }
        });

        // function called in map reduce callbacks
        function done() {
            // one map reduced finished
            done.counter++;
            // when all aggragations done
            if (done.counter > 2)
                resolve('aggregations done')
        }
        // initialize counter static variable
        done.counter = 0;
        // status_ok ? resolve('aggregation done') : reject('aggregation rejected')        
    });
};

const readSessionPromise = (req) => {
    return new Promise( (resolve, reject) => {
        fs.readFile(contextSessionFile.path, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                const dictionary = req.dictionary;
                const RawData = req.model;
                const rawDataJson = {}
                let lines_ok = 0;

                data = data.toString();
                lines = data.split('\n');
                lines.map( (line) => {
                    var fields = line.split('|');
                    for (var i=0; i< dictionary.length; i++){
                        rawDataJson[dictionary[i]] = fields[i];
                    }
                    let r =  new RawData(rawDataJson)
                    if (r.id_session && r.dim_user_agent){
                        r.device = r.dim_device_app_combo.replace(/(.*) -.*/g,'$1');
                        r.save( (err) => {
                            if (err){
                                console.log('err '+err);
                            }
                            else
                                lines_ok++;
                        });
                    }
                });

                const res = {
                    model: req.model,                    
                    previousPhase: 'Session data addition',
                    lines_ok: lines_ok
                }
                resolve(res);
            }
        });
    });
};

const readDictionaryPromise = () => {
    return new Promise( (resolve, reject) => {
        fs.readFile(contextDictionaryFile.path, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                data = data.toString();
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
                const res = {
                    model: RawData,
                    dictionary: dictionary,
                    previousPhase: 'Dictionary addition'
                }
                resolve(res);                
            }
        });
    })
}

function saveData(data, resolve, reject)  {
    // this bound from outside
    console.log('\tSaving data file '+ this.id)
    const f = new FileData();
    f.value = data;
    f._id = this.id;
    f.save( (err) => {
        if (err){
            console.log('\tERR with '+f.id+' : '+err)
            reject(err);        
        }
        else{
            console.log('\tSUCCESS - '+f.id+' added');
            resolve(this.id);
        }
    });
}

const readNodeJsEventLoopFilePromise = () => {
    return new Promise( (resolve, reject) => {
        fs.readFile(contextNodeJsEventLoopFile.path, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                saveData.call(contextNodeJsEventLoopFile, data, resolve, reject);
            }
        });
    })
}

const readReadMeFilePromise = () => {
    return new Promise( (resolve, reject) => {
        fs.readFile(contextReadMeFile.path, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                saveData.call(contextReadMeFile, data, resolve, reject);
            }
        });
    })     
}