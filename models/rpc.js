var apiHost = require('../settings.js').apiHost;
var apiPrefix = require('../settings.js').apiPrefix;
var apiToken = require('../settings.js').apiToken;
var http = require('http');

module.exports = function (apiStr, callback) {
  var options = {
    'host': apiHost,
    'path': apiPrefix + apiStr + '?private_token=' + apiToken,
  }

  cb = function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });
    response.on('end', function() {
      callback(JSON.parse(str));
    });
  }

  http.request(options, cb).end();
}
