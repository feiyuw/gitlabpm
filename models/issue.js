var Cache = require('./cache');
var rpc = require('./rpc');
var Project = require('./project');
var openStates = require('../settings').openStates;
var issueCategories = require('../settings').issueCategories;
var issuePriorities = require('../settings').issuePriorities;
var mixin = require('utils-merge');


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
  Issue.openAll(function(issues) {
    callback(issues.filter(function (issue) {
      return issue.author.name == userName;
    }));
  });
}


Issue.filterAssignee = function (userName, callback) {
  Issue.openAll(function (issues) {
    callback(issues.filter(function (issue) {
      return issue.assignee && issue.assignee.name == userName;
    }));
  });
}


Issue.get = function (projectId, issueId, callback) {
  var projectId = parseInt(projectId);
  var issueId = parseInt(issueId);
  Issue.all(function (issues) {
    var oneIssue = issues.filter(function (issue) {
      return issue.project_id == projectId && issue.id == issueId;
    });
    if (oneIssue) {
      callback(oneIssue[0]);
    } else {
      callback(null);
    }
  });
}


// TODO: now only support to update sprint of one issue
Issue.edit = function (projectId, issueId, sprintId, callback) {
  Issue.get(projectId, issueId, function(issue) {
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
        issue = mixin(issue, returnIssue);
        issue.sprint = issue.milestone && issue.milestone.title || 'unplanned';
        Cache.updateIssue(issue);
      });
      callback(issue);
    }
  });
}


module.exports = Issue;
