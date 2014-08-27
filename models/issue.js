var markdown = require('markdown').markdown;
var cache = require('./cache.js');
var rpc = require('./rpc.js');
var Project = require('./project.js');


function Issue() {
  // model used for Issues, it's just used to provide a model like feature
}


Issue.all = function (callback) {
  if (cache.get('issues')) {
    return callback(cache.get('issues'));
  }
  Project.allOwned(function (projects) {
    var issues = [];
    var projectCount = 0;
    projects.forEach(function (project) {
      rpc('/projects/' + project.id + '/issues', function (projectIssues) {
        projectIssues.forEach(function (issue) {
          issue.description = markdown.toHTML(issue.description);
          issue.project = project.name;
          issue.projectUrl = project.web_url;
        });
        issues = issues.concat(projectIssues);
        projectCount += 1;
        if (projectCount === projects.length) {
          cache.set('issues', issues);
          callback(issues);
        }
      });
    });
  });
}


Issue.openAll = function (callback) {
  Issue.all(function(issues) {
    callback(issues.filter(function(issue) {
      return ['opened', 'reopened'].indexOf(issue.state) >= 0;
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
