// used for webhook interface on gitlab
var express = require('express');
var router = express.Router();
var Issue = require('../models/issue');
var MergeRequest = require('../models/mr');
var Sprint = require('../models/sprint');
var logger = require('../logging').getLogger('webhook');

router.post('/', function(req, res) {
  logger.info('got webhook post');
  logger.debug(req.body);
  hookEvt = req.body;
  if (hookEvt.object_kind == 'issue') {
    // handle issue
    logger.info('it is an issue event');
    Issue.update(hookEvt.object_attributes, function(issues) {
      Sprint.update(issues, function(sprints) {
        res.send({'status': 'ok', 'category': 'issue', 'action': 'update'});
      });
    });
  } else if (hookEvt.object_kind == 'merge_request') {
    // handle merge request
    logger.info('it is a merge request event');
    MergeRequest.update(hookEvt.object_attributes, function(mergeRequests) {
      res.send({'status': 'ok', 'category': 'mergerequest', 'action': 'update'});
    });
  } else {
    // handle push event
    logger.info('it is a push event');
    res.send({'status': 'ok'})
  }
});

module.exports = router;
