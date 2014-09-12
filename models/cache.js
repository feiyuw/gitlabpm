var _cache = {};

function Cache() {
  // base model of cache
}

Cache.get = function(key) {
  return _cache[key];
}

Cache.set = function(key, value) {
  _cache[key] = value;
}

Cache.reset = function() {
  _cache = {};
}

Cache.getIssues = function() {
  return Cache.get('issues');
}

Cache.setIssues = function(value) {
  Cache.set('issues', value);
}


Cache.getMergeRequests = function() {
  return Cache.get('mergerequests');
}

Cache.setMergeRequests = function(value) {
  Cache.set('mergerequests', value);
}

Cache.getSprints = function() {
  return Cache.get('sprints');
}

Cache.setSprints = function(value) {
  Cache.set('sprints', value);
}

Cache.getMileStones = function() {
  return Cache.get('milestones');
}

Cache.setMileStones = function(value) {
  Cache.set('milestones', value);
}

Cache.getAllProjects = function() {
  return Cache.get('allprojects');
}

Cache.setAllProjects = function(value) {
  Cache.set('allprojects', value);
}

Cache.getOwnedProjects = function() {
  return Cache.get('ownedprojects');
}

Cache.setOwnedProjects = function(value) {
  Cache.set('ownedprojects', value);
}


module.exports = Cache;
