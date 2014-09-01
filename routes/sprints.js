/* interfaces for sprints management, including:
 *  1. list issues of each sprints
 */
var express = require('express');
var router = express.Router();
var Sprint = require('../models/sprint')

/* GET API listing. */
router.get('/', function(req, res) {
  Sprint.recent(5, function(sprints) {
    res.render('sprints', { title: 'Sprints',
      user: req.session.user,
      sprints: sprints,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});


router.get('/s/:sprint', function(req, res) {
  Sprint.get(req.params.sprint, function(sprint) {
    res.render('sprints', { title: sprint.name,
      user: req.session.user,
      sprints: [sprint],
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});


module.exports = router;
