var express = require('express');
var router = express.Router();
var Issue = require('../models/issue.js')
var checkLogin = require('./auth').checkLogin;

/* GET API listing. */
router.get('/', function(req, res) {
  res.redirect('/issues/overview');
});

router.get('/overview', function(req, res) {
  Issue.openAll(function(issues) {
    res.render('issuesOverview', { title: 'Issues Overview',
      user: req.session.user,
      issues: issues,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/openall', function(req, res) {
  Issue.openAll(function(issues) {
    res.render('issues', { title: 'Open Issues',
      user: req.session.user,
      issues: issues,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/my', checkLogin);
router.get('/my', function(req, res) {
  Issue.filterAuthor(req.session.user, function(issues) {
    res.render('issues', { title: 'My Issues',
      user: req.session.user,
      issues: issues,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/assigneed', checkLogin);
router.get('/assigneed', function(req, res) {
  Issue.filterAssignee(req.session.user, function(issues) {
    res.render('issues', { title: 'Issues assigneed to me',
      user: req.session.user,
      issues: issues,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/u/:user', function(req, res) {
  Issue.openFilterAuthor(req.params.user, function(issues) {
    res.render('issues', { title: 'Open issues created by ' + req.params.user,
      user: req.params.user,
      issues: issues,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/a/:user', function(req, res) {
  Issue.openFilterAssignee(req.params.user, function(issues) {
    res.render('issues', { title: 'Open issues assigned to ' + req.params.user,
      user: req.params.user,
      issues: issues,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

module.exports = router;
