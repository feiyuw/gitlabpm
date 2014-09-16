var express = require('express');
var router = express.Router();
var checkLogin = require('./auth').checkLogin;
var Sprint = require('../models/sprint');
var Issue = require('../models/issue');
var MergeRequest = require('../models/mr');
var async = require('async');

/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req, res) {
  async.waterfall([
    function(cb) {
      Sprint.current(function(currentSprint) {
        cb(null, currentSprint);
      });
    },
    function(currentSprint, cb) {
      Issue.openFilterAuthor(req.session.user, function(myOpenIssues) {
        cb(null, currentSprint, myOpenIssues);
      });
    },
    function(currentSprint, myOpenIssues, cb) {
      Issue.openFilterAssignee(req.session.user, function(myAssigneedIssues) {
        cb(null, currentSprint, myOpenIssues, myAssigneedIssues);
      });
    },
    function(currentSprint, myOpenIssues, myAssigneedIssues, cb) {
      MergeRequest.openAll(function(ongoingReviews) {
        cb(null, currentSprint, myOpenIssues, myAssigneedIssues, ongoingReviews);
      });
    }
  ], function(err, currentSprint, myOpenIssues, myAssigneedIssues, ongoingReviews) {
    res.render('index', { title: 'My Tasks',
      user: req.session.user,
    currentSprint: currentSprint,
    myOpenIssues: myOpenIssues,
    myAssigneedIssues: myAssigneedIssues,
    ongoingReviews: ongoingReviews,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
    });
  });
});


module.exports = router;
