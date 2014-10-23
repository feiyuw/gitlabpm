var express = require('express');
var path = require('path');
var settings = require('./settings'); // new added for session
var favicon = require('serve-favicon');
var morgan = require('morgan');
var logging = require('./logging');
var cookieParser = require('cookie-parser');
var session = require('express-session'); // new added for session
var flash = require('connect-flash'); // new added for flash
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var issues = require('./routes/issues');
var reviews = require('./routes/reviews');
var sprints = require('./routes/sprints');
var webhook = require('./routes/webhook');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(flash()); // new added for flash
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logging.connectLogger());
if (app.get('env') === 'development') {
  app.use(morgan({
    "format": "default",
    "stream": {
      write: function(str) {
        require("log4js").getLogger().debug(str);
      }
    }
  }));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// new added for session
app.use(session({
  secret: 'gitlabpm',
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
  resave: true,
  saveUninitialized: true,
}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/issues', issues);
app.use('/reviews', reviews);
app.use('/sprints', sprints);
app.use('/webhook', webhook);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
