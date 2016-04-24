"use strict";

var MongoClient = require('mongodb').MongoClient,
    format = require('util').format;

MongoClient.connect('mongodb://127.0.0.1:27017/is', function(err, db) {
    if(err) throw err;

    db.createCollection('map', function (err, collection) {
        collection.insert({'a': 1}, function (err, docs) {
        })
    })


    module.exports = {
        db
    }

})

