var rpc = require('./rpc');
var Cache = require('./cache');

function Project() {
  // model for gitlab Projects
}

Project.all = function (callback) {
  if (Cache.getAllProjects()) {
    return callback(Cache.getAllProjects());
  } else {
    rpc.get('/projects', function(projects) {
      Cache.setAllProjects(projects);
      callback(projects);
    });
  }
}

Project.allOwned = function (callback) {
  if (Cache.getOwnedProjects()) {
    return callback(Cache.getOwnedProjects());
  } else {
    rpc.get('/projects/owned', function(projects) {
      Cache.setOwnedProjects(projects);
      callback(projects);
    });
  }
}

Project.get = function (projectId, callback) {
  var cachedProjects = Cache.getAllProjects();
  if (cachedProjects) {
    for (idx in cachedProjects) {
      if (cachedProjects[idx].id == projectId) {
        return callback(cachedProject[idx]);
      }
    }
  } else {
    rpc.get('/projects/' + projectId, callback);
  }
}

module.exports = Project;
