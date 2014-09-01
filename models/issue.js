var Cache = require('./cache');
var rpc = require('./rpc');
var Project = require('./project');
var openStates = require('../settings').openStates;
var issueCategories = require('../settings').issueCategories;
var issuePriorities = require('../settings').issuePriorities;


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
      rpc('/projects/' + project.id + '/issues', function (projectIssues) {
        projectIssues.forEach(function (issue) {
          issue.project = project.name;
          issue.projectUrl = project.web_url;
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


module.exports = Issue;
