var _cache = {}

function Cache() {
  // base model of cache
}

Cache.get = function(key) {
  return _cache[key];
}

Cache.set = function(key, value) {
  _cache[key] = value;
}

Cache.getIssues = function() {
  return Cache.get('issues');
}

Cache.setIssues = function(value) {
  Cache.set('issues', value);
}

Cache.getMergeRequests = function() {
  return Cache.get('mergeRequests');
}

Cache.setMergeRequests = function(value) {
  Cache.set('mergeRequests', value);
}

Cache.getSprints = function() {
  return Cache.get('sprints');
}

Cache.setSprints = function(value) {
  Cache.set('sprints', value);
}


module.exports = Cache;
