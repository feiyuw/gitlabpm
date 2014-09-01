var Cache = require('./cache');
var rpc = require('./rpc');
var Issue = require('./issue');
var openStates = require('../settings').openStates;

function Sprint() {
  // model used for sprints, it's just used to provide a model like feature
}


Sprint.all = function (callback) {
  if (Cache.getSprints()) {
    return callback(Cache.getSprints());
  }
  Issue.all(function (issues) {
    var sprintDict = {'unplanned': []};
    var sprints = [];
    var issueCount = 0;
    issues.forEach(function (issue) {
      issueCount += 1;
      issue.sprint = issue.milestone && issue.milestone.title || 'unplanned';
      if (issue.sprint == 'unplanned') {
        // only opened/reopened issues will show in unassigned sprints
        if (openStates.indexOf(issue.state) >= 0) {
          console.log(sprintDict);
          sprintDict['unplanned'].push(issue);
        }
      } else {
        if (sprintDict[issue.sprint]) {
          sprintDict[issue.sprint].push(issue);
        } else {
          sprintDict[issue.sprint] = [issue];
        }
      }
      if (issueCount == issues.length) {
        Object.keys(sprintDict).forEach(function (sprintName) {
          var sprint = {};
          sprint.name = sprintName;
          sprint.issues = sprintDict[sprintName];
          sprints.push(sprint);
        });
        Cache.setSprints(sprints);
        callback(sprints);
      }
    });
  });
}


Sprint.recent = function(count, callback) {
  Sprint.all(function (sprints) {
    var devSprints = sprints.filter(function(sprint) {
      return sprint.name != 'unplanned';
    });
    devSprints.sort();
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


module.exports = Sprint;
