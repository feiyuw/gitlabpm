var async = require('async');
var Cache = require('./cache');
var rpc = require('./rpc');
var Issue = require('./issue');
var Project = require('./project');
var MileStone = require('./ms');
var openStates = require('../settings').openStates;

function Sprint() {
  // model used for sprints, it's just used to provide a model like feature
}

// NOTE: all milestones should be shown in Sprint

Sprint.all = function (callback) {
  if (Cache.getSprints()) {
    return callback(Cache.getSprints());
  }

  async.waterfall([
      // get all sprints from projects
      function(cb) {
        var sprintDict = {'unplanned': []};
        var projectCount = 0;
        Project.allOwned(function (projects) {
          projects.forEach(function(project) {
            projectCount += 1;
            MileStone.projectAll(project.id, function(mileStones) {
              mileStones.forEach(function(ms) {
                if (!sprintDict[ms.title]) {
                  sprintDict[ms.title] = [];
                }
              });
            });
            if (projectCount == projects.length) {
              cb(null, sprintDict);
            }
          });
        });
      },
      // set issues of each sprints, and 'unplanned'
      function(sprintDict, cb) {
        Issue.all(function (issues) {
          var issueCount = 0;
          issues.forEach(function (issue) {
            issueCount += 1;
            issue.sprint = issue.milestone && issue.milestone.title || 'unplanned';
            if (issue.sprint == 'unplanned') {
              // only opened/reopened issues will show in unassigned sprints
              if (openStates.indexOf(issue.state) >= 0) {
                sprintDict['unplanned'].push(issue);
              }
            } else {
              sprintDict[issue.sprint].push(issue);
            }
            if (issueCount == issues.length) {
              cb(null, sprintDict);
            }
          });
        });
      }], function(err, sprintDict) {
        var sprints = [];
        Object.keys(sprintDict).forEach(function (sprintName) {
          var sprint = {};
          sprint.name = sprintName;
          sprint.issues = sprintDict[sprintName];
          sprints.push(sprint);
        });
        Cache.setSprints(sprints);
        callback(sprints);
      });
}


Sprint.recent = function(count, callback) {
  Sprint.all(function (sprints) {
    var devSprints = sprints.filter(function(sprint) {
      return sprint.name != 'unplanned';
    });
    devSprints.sort(function(a, b) {
      return parseInt(a.name.replace('sprint', '')) - parseInt(b.name.replace('sprint', ''));
    });
    recentSprints = devSprints.slice(0, count);
    Sprint.get('unplanned', function(sprint) {
      if (sprint.issues) {
        recentSprints.push(sprint);
      }
    });
    callback(recentSprints);
  });
}


Sprint.get = function(sprintName, callback) {
  Sprint.all(function (sprints) {
    var oneSprint = sprints.filter(function(sprint) {
      return sprint.name == sprintName;
    });
    callback(oneSprint[0]);
  });
}


Sprint.new = function(sprintName, dueDate, callback) {
  Project.allOwned(function (projects) {
    var sprints = [];
    var projectCount = 0;

    projects.forEach(function(project) {
      MileStone.getOrCreate(project.id, sprintName, dueDate, function(mileStone) {
        projectCount += 1;
        sprints.push(mileStone);
        if (projectCount == projects.length) {
          callback(sprints);
        }
      });
    });
  });
}


module.exports = Sprint;
