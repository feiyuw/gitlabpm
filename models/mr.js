var markdown = require('markdown').markdown;
var Cache = require('./cache');
var rpc = require('./rpc');
var Project = require('./project');
var async = require('async');
var runInQueue = require('./queue').runInQueue;


function MergeRequest() {
  // model used for merge requests, it's just used to provide a model like feature
}


MergeRequest.openAll = function(callback) {
  if (Cache.getMergeRequests()) {
    return callback(Cache.getMergeRequests());
  }
  Project.all(function(projects) {
    var mergeRequests = [];
    var _queue = runInQueue(function(task, cb) {
      rpc.get('/projects/' + task.project.id + '/merge_requests?state=opened', function(projectMrs) {
        projectMrs.forEach(function(mr) {
          mr.description = markdown.toHTML(mr.description);
          mr.project = task.project.name;
          mr.projectUrl = task.project.web_url;
        });
        mergeRequests = mergeRequests.concat(projectMrs);
        cb();
      });
    }, function() {
      Cache.setMergeRequests(mergeRequests);
      callback(mergeRequests);
    });

    projects.forEach(function(project) {
      _queue.push({'project': project}, function(err) {
      });
    });
  });
}


MergeRequest.filterAuthor = function(userName, callback) {
  MergeRequest.openAll(function(mergeRequests) {
    callback(mergeRequests.filter(function (mr) {
      return mr.author.name == userName;
    }));
  });
}


MergeRequest.update = function(mergeRequest, callback) {
  async.waterfall([
      // get merge request info, as parameter mergeRequest is the value from webhook, it's not the complete one
      function(cb) {
        rpc.get('/projects/' + mergeRequest.target_project_id + '/merge_request/' + mergeRequest.id, function(mr) {
          mr.description = markdown.toHTML(mr.description);
          cb(null, mr);
        });
      },
      // get project, projectUrl for merge request
      function(mr, cb) {
        Project.get(mr.project_id, function(project) {
          mr.project = project.name;
          mr.projectUrl = project.web_url;
          cb(null,mr);
        });
      },
      // update open all merge requests
      function(mr, cb) {
        MergeRequest.openAll(function(mergeRequests) {
          var _doUpdate = false;
          for (idx in mergeRequests) {
            if (mergeRequests[idx].id ==mr.id) {
              if(mergeRequest.state == 'opened') {
                mergeRequests[idx] =mr;
              } else {
                mergeRequests.splice(idx, 1); // remove closed or merged merge request
              }
              _doUpdate = true;
            }
          }
          if(!_doUpdate &&mr.state == 'opened') {
            mergeRequests.push(mr);
          }
          cb(null, mergeRequests);
        })
      }], function(err, mergeRequests) {
        Cache.setMergeRequests(mergeRequests);
        callback(mergeRequests);
      });
}


module.exports = MergeRequest;
