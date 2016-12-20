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

    // Start operations
    readNodeJsEventLoopFilePromise()
        .then((id) => {
            console.log(id+' added (step 2)');
            return readReadMeFilePromise();
        })
        .then( () => {
            console.log('before dictionary');
            return readDictionaryPromise();
        })
        .then( (res) => {
            console.log('dictionary added');
            return readSessionPromise(res);
        })
        .then( (id) => {
            console.log(id+' added (the end)');
            mongoose.connection.close();            
        }).catch( (err) => {
            console.log(err);
        });        
});

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

const readSessionPromise = (res) => {
    return new Promise( (resolve, reject) => {
        fs.readFile(contextSessionFile.path, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                const dictionary = res.dictionary;
                const RawData = res.model;
                data = data.toString();
                lines = data.split('\n');
                const rawDataJson = {}
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
                        });
                    }
                });
                resolve('session data');

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
                const res = {
                    model: RawData,
                    dictionary: dictionary
                }
                resolve(res);                
                // saveData.call(contextNodeJsEventLoopFile, data, resolve, reject);
            }
        });
    })
}



function saveData(data, resolve, reject)  {
    // this bind from outside
    console.log('saveData '+ this.id)
    const f = new FileData();
    f.value = data;
    f._id = this.id;
    f.save( (err) => {
        if (err){
            console.log('ERR with '+f.id+' : '+err)
            reject(err);        
        }
        else{
            console.log('SUCCESS - '+f.id+' added');
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