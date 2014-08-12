var express = require('express');
var router = express.Router();

/* GET API listing. */
router.get('/', function(req, res) {
  res.render('api', { title: 'API' });
});

module.exports = router;
