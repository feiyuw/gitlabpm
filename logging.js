var log4js = require('log4js');

module.exports.getLogger = function(name) {
  var logger = log4js.getLogger(name);
  logger.setLevel('INFO');

  return logger
}
