/*
 * model for milestones
 */
var rpc = require('./rpc');
var Cache = require('./cache');
var Project = require('./project');
var runInQueue = require('./queue').runInQueue;

function MileStone() {
  // model used for MileStones, it's just used to provide a model like feature
}

MileStone.all = function(callback) {
  Project.allOwned(function (projects) {
    var mileStones = {};
    var _queue = runInQueue(function(task, cb) {
      MileStone.projectAll(task.project.id, function(projectMileStones) {
        mileStones[task.project.id] = projectMileStones;
        cb();
      });
    }, function(err) {
      callback(mileStones);
    });
    projects.forEach(function(project) {
      _queue.push({'project': project}, function(err) {
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
  var postUrl = '/projects/' + projectId + '/milestones';
  var postData = {'id': projectId,
                  'title': title,
                  'due_date': dueDate};
  console.log('create new milestone "' + title + '" for project ' + projectId);
  rpc.post(postUrl, postData, function(mileStone) {
    var cachedMileStones = Cache.getMileStones();
    if(cachedMileStones[projectId]) {
      cachedMileStones[projectId].push(mileStone);
    } else {
      cachedMileStones[projectId] = [mileStone];
    }
    Cache.setMileStones(cachedMileStones);
    callback(mileStone);
  });
}


module.exports = MileStone;

