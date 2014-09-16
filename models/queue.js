var async = require('async');
var rpcLimit = require('../settings').rpcLimit;

function runInQueue(workerFunc, drainFunc) {
    var _queue = async.queue(workerFunc, rpcLimit);
    _queue.drain = drainFunc;

    return _queue
}

module.exports.runInQueue = runInQueue;
