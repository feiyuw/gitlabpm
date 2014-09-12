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
      // get all milestones from projects
      function(cb) {
        var mileStones = [];
        var projectCount = 0;
        Project.allOwned(function (projects) {
          projects.forEach(function(project) {
            MileStone.projectAll(project.id, function(projectMileStones) {
              projectCount += 1;
              mileStones = mileStones.concat(projectMileStones);
              if(projectCount == projects.length) {
                cb(null, mileStones);
              }
            });
          });
        });
      },
      // get all sprints from projects
      function(mileStones, cb) {
        var sprintDict = {'unplanned': []};
        mileStones.forEach(function(ms) {
          if (!sprintDict[ms.title]) {
            sprintDict[ms.title] = [];
          }
        });
        cb(null, sprintDict);
      },
      // set issues of each sprints, and 'unplanned'
      function(sprintDict, cb) {
        Issue.all(function (issues) {
          issues.forEach(function (issue) {
            issue.sprint = issue.milestone && issue.milestone.title || 'unplanned';
            if (issue.sprint == 'unplanned') {
              // only opened/reopened issues will show in unassigned sprints
              if (openStates.indexOf(issue.state) >= 0) {
                sprintDict['unplanned'].push(issue);
              }
            } else {
              sprintDict[issue.sprint].push(issue);
            }
          });
          cb(null, sprintDict);
        });
      }
  ], function(err, sprintDict) {
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
  async.waterfall([
      // get dev sprints
      function(cb) {
        Sprint.all(function (sprints) {
          var devSprints = sprints.filter(function(sprint) {
            return sprint.name != 'unplanned';
          });
          cb(null, devSprints);
        });
      },
      // get recent dev sprints
      function(devSprints, cb) {
        devSprints.sort(function(a, b) {
          return parseInt(a.name.replace('sprint', '')) - parseInt(b.name.replace('sprint', ''));
        });
        recentSprints = devSprints.slice(0, count);
        cb(null, recentSprints);
      },
      // add unplanned sprint
      function(recentSprints, cb) {
        Sprint.get('unplanned', function(sprint) {
          if (sprint.issues) {
            recentSprints.push(sprint);
            cb(null, recentSprints);
          }
        });
      }], function(err, recentSprints) {
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


Sprint.update = function(issues, callback) {
  Sprint.all(function(sprints) {
    async.waterfall([
      // init sprintDict
      function(cb) {
        var sprintDict = {};
        for (idx in sprints) {
          sprintDict[sprints[idx].name] = [];
        }
        cb(null, sprintDict);
      },
      // generate sprint dict with new issues
      function(sprintDict, cb) {
        for (_i in issues) {
          var issue = issues[_i];
          if (issue.sprint == 'unplanned') {
            // only opened/reopened issues will show in unassigned sprints
            if (openStates.indexOf(issue.state) >= 0) {
              sprintDict['unplanned'].push(issue);
            }
          } else if(!sprintDict[issue.sprint]) { 
            sprintDict[issue.sprint] = [issue];
          }else {
            sprintDict[issue.sprint].push(issue);
          }
        }
        cb(null, sprintDict);
      },
      // recreate sprints
      function(sprintDict, cb) {
        var updatedSprints = [];
        Object.keys(sprintDict).forEach(function (sprintName) {
          var sprint = {};
          sprint.name = sprintName;
          sprint.issues = sprintDict[sprintName];
          updatedSprints.push(sprint);
        });
        cb(null, updatedSprints);
      }], function(err, updatedSprints) {
        Cache.setSprints(updatedSprints);
        callback(updatedSprints);
      });
  });
}


module.exports = Sprint;
