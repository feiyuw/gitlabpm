var apiHost = require('../settings').apiHost;
var apiPrefix = require('../settings').apiPrefix;
var apiToken = require('../settings').apiToken;
var http = require('http');

module.exports = function (apiStr, callback) {
  var path = apiPrefix + apiStr;
  if (path.indexOf('?') >= 0) {
    path += '&private_token='
  } else {
    path += '?private_token='
  }
  path += apiToken;
  var options = {
    'host': apiHost,
    'path': path,
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
