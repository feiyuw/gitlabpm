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
        var sprintDueDict = {'unplanned': null};
        mileStones.forEach(function(ms) {
          if (!sprintDict[ms.title]) {
            sprintDict[ms.title] = [];
          }
          if (!sprintDueDict[ms.title]) {
            sprintDueDict[ms.title] = ms.due_date;
          }
        });
        cb(null, sprintDict, sprintDueDict);
      },
      // set issues of each sprints, and 'unplanned'
      function(sprintDict, sprintDueDict, cb) {
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
          cb(null, sprintDict, sprintDueDict);
        });
      }
  ], function(err, sprintDict, sprintDueDict) {
    var sprints = [];
    Object.keys(sprintDict).forEach(function (sprintName) {
      var sprint = {};
      sprint.name = sprintName;
      sprint.dueDate = sprintDueDict[sprintName];
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
          devSprints.sort(function(a, b) {
            return parseInt(a.name.replace('sprint', '')) - parseInt(b.name.replace('sprint', ''));
          });
          cb(null, devSprints);
        });
      },
      // get recent dev sprints
      function(devSprints, cb) {
        var startIdx = 0;
        for(idx in devSprints) {
          if(devSprints[idx].dueDate >= getToday()) {
            startIdx = idx - parseInt(count/2) > 0
                     ? idx - parseInt(count/2)
                     : 0;
            break;
          }
        }
        recentSprints = devSprints.slice(startIdx, count);
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
        var sprintDueDict = {};
        for (idx in sprints) {
          sprintDict[sprints[idx].name] = [];
          sprintDueDict[sprints[idx].name] = null;
        }
        cb(null, sprintDict, sprintDueDict);
      },
      // generate sprint dict with new issues
      function(sprintDict, sprintDueDict, cb) {
        for (_i in issues) {
          var issue = issues[_i];
          if (issue.sprint == 'unplanned') {
            // only opened/reopened issues will show in unassigned sprints
            if (openStates.indexOf(issue.state) >= 0) {
              sprintDict['unplanned'].push(issue);
            }
          } else if(!sprintDict[issue.sprint]) {
            sprintDict[issue.sprint] = [issue];
            sprintDueDict[issue.sprint] = issue.milestone.due_date;
          } else {
            sprintDict[issue.sprint].push(issue);
          }
        }
        cb(null, sprintDict, sprintDueDict);
      },
      // recreate sprints
      function(sprintDict, sprintDueDict, cb) {
        var updatedSprints = [];
        Object.keys(sprintDict).forEach(function(sprintName) {
          var sprint = {};
          sprint.name = sprintName;
          sprint.issues = sprintDict[sprintName];
          sprint.dueDate = sprintDueDict[sprintName];
          updatedSprints.push(sprint);
        });
        cb(null, updatedSprints);
      }], function(err, updatedSprints) {
        Cache.setSprints(updatedSprints);
        callback(updatedSprints);
      });
  });
}


Sprint.current = function(callback) {
  Sprint.all(function(sprints) {
    sprints.sort(function(a, b) {
      if(a == 'unplanned') {
        return true;
      }
      if(b == 'unplanned') {
        return false;
      }
      return parseInt(a.name.replace('sprint', '')) - parseInt(b.name.replace('sprint', ''));
    });
    for(idx in sprints) {
      if (sprints[idx].dueDate >= getToday()) {
        return callback(sprints[idx]);
      }
    }
    return callback(null);
  });
}


function getToday() {
  var now = new Date();
  var nowMonth = now.getMonth() + 1 >= 10
               ? '' + (now.getMonth() + 1)
               : '0' + (now.getMonth() + 1);
  var nowDay = now.getDate() >= 10
             ? '' + now.getDate()
             : '0' + now.getDate();

  return now.getFullYear() + '-' + nowMonth + '-' + nowDay;
}


module.exports = Sprint;
