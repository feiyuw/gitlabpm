var markdown = require('markdown').markdown;
var Cache = require('./cache.js');
var rpc = require('./rpc.js');
var Project = require('./project.js');


function MergeRequest() {
  // model used for merge requests, it's just used to provide a model like feature
}


MergeRequest.openAll = function (callback) {
  if (Cache.getMergeRequests()) {
    return callback(Cache.getMergeRequests());
  }
  Project.allOwned(function (projects) {
    var mergeRequests = [];
    var projectCount = 0;
    projects.forEach(function (project) {
      rpc.get('/projects/' + project.id + '/merge_requests?state=opened', function (projectMrs) {
        projectMrs.forEach(function (mr) {
          mr.description = markdown.toHTML(mr.description);
          mr.project = project.name;
          mr.projectUrl = project.web_url;
        });
        mergeRequests = mergeRequests.concat(projectMrs);
        projectCount += 1;
        if (projectCount === projects.length) {
          Cache.setMergeRequests(mergeRequests);
          callback(mergeRequests);
        }
      });
    });
  });
}


MergeRequest.filterAuthor = function (userName, callback) {
  MergeRequest.openAll(function(mergeRequests) {
    callback(mergeRequests.filter(function (mr) {
      return mr.author.name == userName;
    }));
  });
}


module.exports = MergeRequest;
