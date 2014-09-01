// used for webhook interface on gitlab
var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  console.log('got webhook post');
  hookEvt = JSON.parse(req.body);
  if (hookEvt.object_kind == 'issue') {
    // handle issue
  } else if (hookEvt.object_kind == 'merge_request') {
    // handle merge request
  } else {
    // handle push event
  }
  res.send({'status': 'ok'});
});

module.exports = router;
