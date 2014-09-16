var Cache = require('./cache');
var rpc = require('./rpc');
var Project = require('./project');
var openStates = require('../settings').openStates;
var issueCategories = require('../settings').issueCategories;
var issuePriorities = require('../settings').issuePriorities;
var async = require('async');


function Issue() {
  // model used for Issues, it's just used to provide a model like feature
}


Issue.all = function (callback) {
  if (Cache.getIssues()) {
    return callback(Cache.getIssues());
  }
  Project.allOwned(function (projects) {
    var issues = [];
    var projectCount = 0;
    projects.forEach(function (project) {
      rpc.get('/projects/' + project.id + '/issues', function (projectIssues) {
        projectIssues.forEach(function (issue) {
          issue.project = project.name;
          issue.projectUrl = project.web_url;
          issue.sprint = issue.milestone && issue.milestone.title || 'unplanned';
          issue.labels.forEach(function(label) {
            if (issueCategories.indexOf(label) >= 0) {
              issue.category = label;
            } else if (issuePriorities.indexOf(label) >= 0) {
              issue.priority = label;
            }
          });
        });
        issues = issues.concat(projectIssues);
        projectCount += 1;
        if (projectCount === projects.length) {
          Cache.setIssues(issues);
          callback(issues);
        }
      });
    });
  });
}


Issue.openAll = function (callback) {
  Issue.all(function(issues) {
    callback(issues.filter(function(issue) {
      return openStates.indexOf(issue.state) >= 0;
    }));
  });
}


Issue.filterAuthor = function (userName, callback) {
  var filterFunc = function(issue) {
    return issue.author.name == userName;
  };
  Issue._filter(Issue.all, filterFunc, callback);
}

Issue.openFilterAuthor = function (userName, callback) {
  var filterFunc = function(issue) {
    return issue.author.name == userName;
  };
  Issue._filter(Issue.openAll, filterFunc, callback);
}

Issue.filterAssignee = function (userName, callback) {
  var filterFunc = function(issue) {
    return issue.assignee && issue.assignee.name == userName;
  };
  Issue._filter(Issue.all, filterFunc, callback);
}

Issue.openFilterAssignee = function (userName, callback) {
  var filterFunc = function(issue) {
    return issue.assignee && issue.assignee.name == userName;
  };
  Issue._filter(Issue.openAll, filterFunc, callback);
}

// private function, used to filter issues
Issue._filter = function(allFunc, filterFunc, callback) {
  allFunc(function(issues) {
    callback(issues.filter(function(issue) {
      return filterFunc(issue);
    }));
  });
}


Issue.get = function (issueId, callback) {
  var issueId = parseInt(issueId);
  Issue.all(function (issues) {
    var oneIssue = issues.filter(function (issue) {
      return issue.id == issueId;
    });
    if (oneIssue) {
      callback(oneIssue[0]);
    } else {
      callback(null);
    }
  });
}


// TODO: now only support to update sprint of one issue
Issue.edit = function (issueId, sprintId, callback) {
  Issue.get(issueId, function(issue) {
    if (issue) {
      var putUrl = '/projects/' + issue.project_id + '/issues/' + issue.id;
      var putData = {
        /* 
         * id (required) - The ID of a project
         * issue_id (required) - The ID of a project's issue
         * title (optional) - The title of an issue
         * description (optional) - The description of an issue
         * assignee_id (optional) - The ID of a user to assign issue
         * milestone_id (optional) - The ID of a milestone to assign issue
         * labels (optional) - Comma-separated label names for an issue
         * state_event (optional) - The state event of an issue ('close' to close issue and 'reopen' to reopen it)
         */
        'id': issue.project_id,
        'issue_id': issue.id,
      };
      if (sprintId) {
        putData['milestone_id'] = sprintId;
      }
      rpc.put(putUrl, putData, function(returnIssue) {
        callback(returnIssue);
      });
    }
  });
}


// used in webhook
Issue.update = function(issue, callback) {
  async.waterfall([
      // get issue info, as parameter issue is the value from webhook, it's not the complete one
      function(cb) {
        rpc.get('/projects/' + issue.project_id + '/issues/' + issue.id, function (issue) {
          cb(null, issue);
        });
      },
      // get sprint, category and priority of issue
      function(issue, cb) {
        issue.sprint = issue.milestone && issue.milestone.title || 'unplanned';
        issue.labels.forEach(function(label) {
          if (issueCategories.indexOf(label) >= 0) {
            issue.category = label;
          } else if (issuePriorities.indexOf(label) >= 0) {
            issue.priority = label;
          }
        });
        cb(null, issue);
      },
      // get project, projectUrl of issue
      function(issue, cb) {
        Project.get(issue.project_id, function(project) {
          issue.project = project.name;
          issue.projectUrl = project.web_url;
          cb(null, issue);
        });
      }], function(err, issue) {
        Issue.all(function(issues) {
          var _doUpdate = false;
          for (idx in issues) {
            if(issues[idx].id == issue.id) {
              issues[idx] = issue;
              _doUpdate = true;
              break;
            }
          }
          if (!_doUpdate) {
            issues.push(issue);
          }
          Cache.setIssues(issues);
          callback(issues);
        });
      });
}


module.exports = Issue;
