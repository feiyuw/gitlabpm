/*
 * model for milestones
 */
var rpc = require('./rpc');
var Cache = require('./cache');
var Project = require('./project');

function MileStone() {
  // model used for MileStones, it's just used to provide a model like feature
}

MileStone.all = function(callback) {
  Project.allOwned(function (projects) {
    var projectCount = 0;
    var mileStones = {};
    projects.forEach(function(project) {
      projectCount += 1;
      MileStone.projectAll(project.id, function(projectMileStones) {
        mileStones[project.id] = projectMileStones;
        if (projectCount == projects.length) {
          callback(mileStones);
        }
      });
    });
  });
}

MileStone.projectAll = function(projectId, callback) {
  var cachedMileStones = Cache.getMileStones();
  if (cachedMileStones && cachedMileStones[projectId]) {
    return callback(cachedMileStones[projectId]);
  }
  rpc.get('/projects/' + projectId + '/milestones', function (milestones) {
    if (cachedMileStones === undefined) {
      Cache.setMileStones({projectId: milestones});
    } else {
      cachedMileStones[projectId] = milestones;
      Cache.setMileStones(cachedMileStones);
    }
    callback(milestones);
  });
}

MileStone.projectFilter = function(title, projectId, callback) {
  MileStone.projectAll(projectId, function(mileStones) {
    var filteredMileStones = mileStones.filter(function(milestone) {
      return milestone.title == title;
    });
    callback(filteredMileStones);
  });
}

MileStone.getOrCreate = function(projectId, title, dueDate, callback) {
  MileStone.projectFilter(title, projectId, function(mileStones) {
    if (mileStones.length > 0) {
      console.log('use exist milestone ' + title + ' for project[' + projectId + '] ');
      callback(mileStones[0]);
    } else {
      MileStone.new(projectId, title, dueDate, function(mileStone) {
        callback(mileStone);
      });
    }
  });
}

MileStone.new = function(projectId, title, dueDate, callback) {
  var postUrl = '/projects/' + project.id + '/milestones';
  var postData = {'id': projectId,
                  'title': title,
                  'due_date': dueDate};
  console.log('create new milestone "' + title + '" for project ' + projectId);
  rpc.post(postUrl, postData, function(mileStone) {
    callback(mileStone);
  });
}


module.exports = MileStone;

