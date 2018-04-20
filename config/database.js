// const mongoose = require('mongoose')
// var app = express()
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/hrtbot";
// mongoose.connect(url)
//
//
// //CREATE DATABASE
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });
//
//
// var userSchema = new mongoose.Schema({
//   name:String,
//   email:String,
// })
//
// var user = mongoose.model("User",userSchema)
//

// var mdb = require ('mongoose')
//
// module.exports = function(config) {
//
//       if (!config || !config.mongoUri)
//         throw new Error ('Need to provide mongo address...');
//
//       var userSchema = new mdb.Schema({
//         name:String,
//         email:String,
//       })
//       var teamSchema = new mdb.Schema ({
//         id:String,
//         name:String,
//         link:String,
//       })
//       var channelSchema = new mdb.Schema ({
//         id:String,
//         name:String,
//         link:String,
//       })
//     }
//
//     var user = mongoose.model("User", userSchema)
//     var team = mongoose.model("Team", teamSchema)
//     var channel = mongoose.model("Channel", channelSchema)
//
//     var unwrapFromList = function(cb) {
//         return function(err, data) {
//             if (err) return cb(err);
//             cb(null, data);
//         };
//     };
//


var db = require('monk');
/**
 * botkit-storage-mongo - MongoDB driver for Botkit
 *
 * @param  {Object} config
 * @return {Object}
 */
module.exports = function(config) {

    if (!config || !config.mongoUri)
        throw new Error('Need to provide mongo address.');

    var Teams = db(config.mongoUri).get('teams'),
        Users = db(config.mongoUri).get('users'),
        Channels = db(config.mongoUri).get('channels');

    var unwrapFromList = function(cb) {
        return function(err, data) {
            if (err) return cb(err);
            cb(null, data);
        };
    };

    var storage = {
        teams: {
            get: function(id, cb) {
                Teams.findOne({id: id}, unwrapFromList(cb));
            },
            save: function(data, cb) {
                Teams.findOneAndUpdate({
                    id: data.id
                }, data, {
                    upsert: true,
                    new: true
                }, cb);
            },
            all: function(cb) {
                Teams.find({}, cb);
            }
        },
        users: {
            get: function(id, cb) {
                Users.findOne({id: id}, unwrapFromList(cb));
            },
            save: function(data, cb) {
                Users.findOneAndUpdate({
                    id: data.id
                }, data, {
                    upsert: true,
                    new: true
                }, cb);
            },
            all: function(cb) {
                Users.find({}, cb);
            }
        },
        channels: {
            get: function(id, cb) {
                Channels.findOne({id: id}, unwrapFromList(cb));
            },
            save: function(data, cb) {
                Channels.fifindOneAndUpdate({
                    id: data.id
                }, data, {
                    upsert: true,
                    new: true
                }, cb);
            },
            all: function(cb) {
                Channels.find({}, cb);
            }
        }
    };

    return storage;
};
