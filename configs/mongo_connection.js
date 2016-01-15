var config = require('./config');
var mongoose = require("mongoose");

var connectionString = config.mongodbConfig.connectionString;
try{
    console.log('connectionString::', connectionString);
    mongoose.connect(connectionString);
    mongoose.connection.on("connected", function() {
        console.log("MongoDb connected to " + connectionString);
    });

    mongoose.connection.on("error", function(error) {
        console.log("MongoDb connection to " + connectionString + " failed:" + error);
    });

    mongoose.connection.on("disconnected", function() {
        console.log("MongoDb disconnected from " + connectionString);
    });

    process.on("SIGINT", function() {
        mongoose.connection.close(function() {
            console.log("MongoDb disconnected from " + connectionString + " through app termination");
            process.exit(0);
        });
    });
}
catch(err){
    console.log('err:::', err);
}

module.exports = mongoose;

