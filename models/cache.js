var cache = {}

module.exports.get = function(key) {
  return cache[key];
}

module.exports.set = function(key, value) {
  cache[key] = value;
}
