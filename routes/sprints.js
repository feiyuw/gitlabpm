/* interfaces for sprints management, including:
 *  1. list issues of each sprints
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var Sprint = require('../models/sprint');
var Issue = require('../models/issue');

// show recent 5 sprints and unplanned sprint status
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


// show specified sprint status, including project issues chart, and issue list
router.get('/s/:sprint', function(req, res) {
  Sprint.get(req.params.sprint, function(sprint) {
    res.render('oneSprint', { title: sprint.name,
      user: req.session.user,
      sprint: sprint,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});


// create new sprint
router.get('/new', function(req, res) {
  Sprint.get('unplanned', function(sprint) {
    res.render('newSprint', { title: 'Add new sprint',
      user: req.session.user,
      issues: sprint.issues,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

// create new sprint, and add issue to new sprint
router.post('/new', function(req, res) {
  var sprintName = req.body.sprint.trim();
  var dueDate = req.body.dueDate.trim();
  var sprintIssues = typeof(req.body.sprintIssues) == 'string'
                      ? [req.body.sprintIssues]
                      : req.body.sprintIssues;
  var projectIssues = {};
  async.waterfall([
    // generate project ==> issue mapping
    function(cb) {
      for (idx in sprintIssues) {
        var pIssue = sprintIssues[idx].split(':');
        if (projectIssues[pIssue[0]]) {
          projectIssues[pIssue[0]].push(pIssue[1]);
        } else {
          projectIssues[pIssue[0]] = [pIssue[1]];
        }
      }
      cb(null);
    }, 
    // create new sprint, and generate project ==> sprint mapping
    function(cb) {
      var projectSprints = {};
      Sprint.new(sprintName, dueDate, function (sprints) {
        for (idx in sprints) {
          var sprint = sprints[idx];
          projectSprints[sprint.project_id] = sprint;
        }
        cb(null, projectSprints);
      });
    },
    // update milestone of all selected issues
    function(projectSprints, cb) {
      var issueCount = 0;
      for(projectId in projectIssues) {
        sprint = projectSprints[projectId];
        projectIssues[projectId].forEach(function(issueId){
          Issue.edit(issueId, sprint.id, function(issue){
            issueCount += 1;
            if(issueCount == sprintIssues.length) {
              cb(null);
            }
          });
        });
      }
    }], function(err) {
      if(err) {
        req.flash('error', err);
        res.redirect('back');
      } else {
        req.flash('success', 'new sprint added!');
        res.redirect('/sprints');
      }
    });
});


module.exports = router;
