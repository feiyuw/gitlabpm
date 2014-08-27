var express = require('express');
var router = express.Router();
var Issue = require('../models/issue.js')

/* GET API listing. */
router.get('/', function(req, res) {
  Issue.openAll(function(issues) {
    res.render('issues', { title: 'Issues',
      user: req.session.user,
      issues: issues,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/u/:user', function(req, res) {
  Issue.filterAuthor(req.params.user, function(issues) {
    res.render('issues', { title: 'Issues created by ' + req.params.user,
      user: req.params.user,
      issues: issues,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/a/:user', function(req, res) {
  Issue.filterAssignee(req.params.user, function(issues) {
    res.render('issues', { title: 'Issues assigned to ' + req.params.user,
      user: req.params.user,
      issues: issues,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

module.exports = router;
