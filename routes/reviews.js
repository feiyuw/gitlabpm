/* interfaces for code reviews, including:
 *  1. list all open merge requests
 *  2. show CI status of one merge request
 *  3. show +1/-1 result of one merge request
 */
var express = require('express');
var router = express.Router();
var MergeRequest = require('../models/mr.js')
var checkLogin = require('./auth').checkLogin;

/* GET API listing. */
router.get('/', checkLogin);
router.get('/', function(req, res) {
  MergeRequest.openAll(function(mergeRequests) {
    var myMergeRequests = mergeRequests.filter(function (mr) {
      return mr.author.name == req.session.user;
    });
    var otherMergeRequests = mergeRequests.filter(function (mr) {
      return mr.author.name != req.session.user;
    });
    res.render('reviews', { title: 'Reviews',
      user: req.session.user,
      myMergeRequests: myMergeRequests,
      otherMergeRequests: otherMergeRequests,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});


router.get('/u/:user', function(req, res) {
  MergeRequest.filterAuthor(req.params.user, function(mergeRequests) {
    var myMergeRequests = mergeRequests.filter(function (mr) {
      return mr.author.name == req.session.user;
    });
    var otherMergeRequests = mergeRequests.filter(function (mr) {
      return mr.author.name != req.session.user;
    });
    res.render('reviews', { title: 'Reviews for merge requests created by ' + req.params.user,
      user: req.params.user,
      myMergeRequests: myMergeRequests,
      otherMergeRequests: otherMergeRequests,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});


module.exports = router;
