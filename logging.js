var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    {
      type: 'file',
      filename: 'logs/access.log', 
      maxLogSize: 1024,
      backups:4
    }
  ],
  replaceConsole: true
});

exports.getLogger = function(name) {
  var logger = log4js.getLogger(name);
  logger.setLevel('INFO');

  return logger
}

exports.connectLogger = function() {
  return log4js.connectLogger(this.getLogger('normal'),
                              {level: log4js.levels.DEBUG, format: ':method :url'});
}
