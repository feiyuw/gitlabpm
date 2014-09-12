// used for webhook interface on gitlab
var express = require('express');
var router = express.Router();
var Issue = require('../models/issue');
var MergeRequest = require('../models/mr');
var Sprint = require('../models/sprint');

router.post('/', function(req, res) {
  console.log('got webhook post');
  console.log(req.body);
  hookEvt = req.body;
  if (hookEvt.object_kind == 'issue') {
    // handle issue
    console.log('it is an issue event');
    Issue.update(hookEvt.object_attributes, function(issues) {
      Sprint.update(issues, function(sprints) {
        res.send({'status': 'ok', 'category': 'issue', 'action': 'update'});
      });
    });
  } else if (hookEvt.object_kind == 'merge_request') {
    // handle merge request
    console.log('it is a merge request event');
    MergeRequest.update(hookEvt.object_attributes, function(mergeRequests) {
      res.send({'status': 'ok', 'category': 'mergerequest', 'action': 'update'});
    });
  } else {
    // handle push event
    console.log('it is a push event');
    res.send({'status': 'ok'})
  }
});

module.exports = router;
