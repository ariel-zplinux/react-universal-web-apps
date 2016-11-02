const mongoose =  require('mongoose');
const db = mongoose.connect("mongodb://localhost/mydb");


const ClientsPerUserDeviceSchemaJson = {
    _id: String,
    value: {} 
};
// initialize RawData schema and model
const ClientsPerUserDeviceSchema = mongoose.Schema(
    ClientsPerUserDeviceSchemaJson,
    { collection: "clients_per_user_device" },
    { skipInit: true}
);
const ClientsPerUserDevice = mongoose.model("ClientsPerUserDevice", ClientsPerUserDeviceSchema);


// mongoose.connect("mongodb://localhost/mydb"); 
// var Schema = mongoose.Schema; 
// var User = mongoose.model("User", new Schema({}), "client_per_user_device"); 
// User.find({}, function(err, doc){ console.log((doc)) })
// mongoose.connection.on("open", function(){
//   console.log("mongodb is connected!!");
// });
ClientsPerUserDevice.find({}).exec().then( (doc, err) => {
    console.log({
        items: doc.map(r => r.value)
    });
    console.log(err);
    mongoose.connection.close();
})