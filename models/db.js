var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    poolModule = require('generic-pool'),
    pool = poolModule.Pool({
        name: settings.pool || 'glp',
        create: function(callback) {
            var mongodb = new Db(settings.db, new Server(settings.host, settings.port || Connection.DEFAULT_PORT), {safe: true});
            mongodb.open(function(err, db) {
                callback(err, db);
            })
        },
        destroy: function(mongodb) {
            mongodb.close();
        },
        max: 100,
        min: 5,
        idleTimeoutMillis: 30000,
        log: true
    });

module.exports = pool;
