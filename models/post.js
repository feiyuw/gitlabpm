var markdown = require('markdown').markdown;
var async = require('async');
var pool = require('./db');

function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}

module.exports = Post;

Post.prototype.save = function(callback) {
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post
    };

    async.waterfall([
            function(cb) {
                pool.acquire(function(err, mongodb) {
                    cb(err, mongodb);
                });
            },
            function(mongodb, cb) {
                mongodb.collection('posts', function(err, collection) {
                    pool.release(mongodb);
                    cb(err, collection);
                });
            },
            function(collection, cb) {
                collection.insert(post, {
                    safe: true
                }, function(err) {
                    cb(err);
                });
            }
            ], function(err) {
                callback(err);
            });
};

Post.getAll = function(name, callback) {
    async.waterfall([
            function(cb) {
                pool.acquire(function(err, mongodb) {
                    cb(err, mongodb);
                });
            },
            function(mongodb, cb) {
                mongodb.collection('posts', function(err, collection) {
                    pool.release(mongodb);
                    cb(err, collection);
                });
            },
            function(collection, cb) {
                var query = {};
                if(name) {
                    query.name = name;
                }
                collection.find(query).sort({
                    time: -1
                }).toArray(function(err, docs) {
                    cb(err, docs);
                });
            },
            ], function(err, docs) {
                docs.forEach(function(doc) {
                    doc.post = markdown.toHTML(doc.post);
                });
                callback(err, docs);
            });
};

Post.getOne = function(name, day, title, callback) {
    async.waterfall([
            function(cb) {
                pool.acquire(function(err, mongodb) {
                    cb(err, mongodb);
                });
            },
            function(mongodb, cb) {
                mongodb.collection('posts', function(err, collection) {
                    pool.release(mongodb);
                    cb(err, collection);
                });
            },
            function(collection, cb) {
                collection.findOne({
                    "name": name,
                "time.day": day,
                "title": title
                }, function(err, doc) {
                    cb(err, doc);
                });
            }
            ], function(err, doc) {
                doc.post = markdown.toHTML(doc.post);
                callback(err, doc);
            });
};

Post.edit = function(name, day, title, callback) {
    async.waterfall([
            function(cb) {
                pool.acquire(function(err, mongodb) {
                    cb(err, mongodb);
                });
            },
            function(mongodb, cb) {
                mongodb.collection('posts', function(err, collection) {
                    pool.release(mongodb);
                    cb(err, collection);
                });
            },
            function(collection, cb) {
                collection.findOne({
                    "name": name,
                "time.day": day,
                "title": title
                }, function(err, doc) {
                    cb(err, doc);
                });
            }
            ], function(err, doc) {
                callback(err, doc);
            });
}

Post.update = function(name, day, title, post, callback) {
    async.waterfall([
            function(cb) {
                pool.acquire(function(err, mongodb) {
                    cb(err, mongodb);
                });
            },
            function(mongodb, cb) {
                mongodb.collection('posts', function(err, collection) {
                    pool.release(mongodb);
                    cb(err, collection);
                });
            },
            function(collection, cb) {
                collection.update({
                    "name": name,
                "time.day": day,
                "title": title
                }, {
                    $set: {
                        post: post
                    }
                }, function(err, doc) {
                    cb(err, doc)
                });
            }
    ], function(err, doc) {
        callback(err, doc);
    });
};

Post.remove = function(name, day, title, callback) {
    async.waterfall([
            function(cb) {
                pool.acquire(function(err, mongodb) {
                    cb(err, mongodb);
                });
            },
            function(mongodb, cb) {
                mongodb.collection('posts', function(err, collection) {
                    pool.release(mongodb);
                    cb(err, collection);
                });
            },
            function(collection, cb) {
                collection.remove({
                    "name": name,
                "time.day": day,
                "title": title
                }, {
                    w: 1
                }, function(err) {
                    cb(err)
                });
            }
    ], function(err) {
        callback(err);
    });
};
