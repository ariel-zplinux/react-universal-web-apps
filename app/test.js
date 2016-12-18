require('babel/register');
const fs = require('fs');

// model FileData
const FileData = require('./models/FileData.js');

// Initialize database as soon as possible
const mongoose = require('./infra/db-manager');
process.nextTick(() => {
        mongoose.connection.once('connected', () => {
            // drop db to start in a clean state
            console.log('Database intialized');
            mongoose.connection.db.dropDatabase();
        });
})


// const readNodeJsEventLoopPath = "app/fixtures/nodejs-event-loop-explanations.md";
const contextNodeJsEventLoopFile = {
    id: 'nodejs_event_loop',
    path: 'app/fixtures/nodejs-event-loop-explanations.md'
}
const contextReadMeFile = {
    id: 'readme',
    path: 'README.md'
}


// const readDictionaryStream =  createReadStream("app/fixtures/session_dictionary.txt");
// const readSessionStream = createReadStream("app/fixtures/airbnb_session_data.txt");
// // const readNodeJsEventLoopStream =  createReadStream("app/fixtures/nodejs_event_loop.txt");
// const readNodeJsEventLoopStream =  createReadStream("app/fixtures/nodejs-event-loop-explanations.md");
// const readReadmeStream =  createReadStream("README.md");
// const writeLogStream = createWriteStream("app/log/log.txt");
// // const readSessionStream = createReadStream("app/fixtures/session_data.txt");

let lines_ok=0, lines_ko=0;

function saveData(data, resolve, reject)  {
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
            resolve();
        }
    });
}

// const InitDbPromise = new Promise( (resolve, reject) => {
//     process.nextTick ( () => {
//         mongoose.connection.once('connected', () => {
//             // drop db to start in a clean state
//             console.log('Database intialized');
//             mongoose.connection.db.dropDatabase();
//         });

//     })
//     console.log('init db')    
//     resolve();
// })

// const readNodeJsEventLoopFilePromise2 = new Promise( (saveData, reject) => {
//     console.log('inside p12');
//     fs.readFile(contextNodeJsEventLoopFile.path);
//     }).then( (err, data) => {
//         console.log('inside callback p1 '+err);
//         console.log(data);
//         console.log(saveData);
//         err ? reject(err) : saveData.call(contextNodeJsEventLoopFile, data)
//     })
const readNodeJsEventLoopFilePromise = new Promise( (resolve, reject) => {
    fs.readFile(contextNodeJsEventLoopFile.path, (err, data) => {
        if (err) {
            reject(err)
        }
        else {
            saveData.call(contextNodeJsEventLoopFile, data, resolve, reject);
        }
    });
})

const readReadMeFilePromise = new Promise( (resolve, reject) => {
    fs.readFile(contextReadMeFile.path, (err, data) => {
        if (err) {
            reject(err)
        }
        else {
            saveData.call(contextReadMeFile, data, resolve, reject);
        }
    });
})

// const readReadmeFilePromise = new Promise( (saveData, reject) => {
//     console.log('inside p2');
//     fs.readFile(contextReadMeFile.path, (err, data) => {
//         console.log('inside callback p2 '+err);
//         err ? reject(err) : saveData.call(contextReadMeFile, data)
//     });
// })

const promises = new Array(readNodeJsEventLoopFilePromise, readReadMeFilePromise);

const runPromises = (promises) => {
    return Promise.all(promises);    
}
console.log('before promises');
runPromises(promises).then( () => {
    console.log('the end');
    mongoose.connection.close();
    
}).catch( (err) => {
    console.log(err);
});
