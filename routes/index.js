var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // TODO: homepage show my tasks view
  res.render('index', { title: 'Home',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});


module.exports = router;
