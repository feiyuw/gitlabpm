var apiHost = require('../settings').apiHost;
var apiPrefix = require('../settings').apiPrefix;
var apiToken = require('../settings').apiToken;
var http = require('http');
var querystring = require('querystring');

module.exports.get = function (apiStr, callback) {
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

module.exports.put = function(apiStr, reqData, callback) {
  return _httpRequest('PUT', apiStr, reqData, callback);
}

module.exports.post = function(apiStr, reqData, callback) {
  return _httpRequest('POST', apiStr, reqData, callback);
}

function _httpRequest(method, apiStr, reqData, callback) {
  var reqData = querystring.stringify(reqData);
  var path = apiPrefix + apiStr + '?private_token=' + apiToken;
  var options = {
    'host': apiHost,
    'path': path,
    'method': method,
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': reqData.length,
    },
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

  _req = http.request(options, cb);
  _req.write(reqData);
  _req.end();
}

