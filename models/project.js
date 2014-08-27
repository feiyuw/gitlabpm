var rpc = require('./rpc.js');

function Project() {
  // model for gitlab Projects
}

Project.all = function (callback) {
  rpc('/projects', callback);
}

Project.allOwned = function (callback) {
  rpc('/projects/owned', callback);
}

module.exports = Project;
