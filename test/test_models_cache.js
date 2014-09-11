var assert = require('assert');
var Cache = require('../models/cache');

describe('Cache', function() {
  describe('#get', function() {
    it('should return null when the cache is not set', function() {
      assert.equal(null, Cache.get('new'));
    })
  });
  
  describe('#set', function() {
    it('should return cached value when the cache is set', function() {
      assert.equal(null, Cache.get('cached'));
      Cache.set('cached', 'default value');
      assert.equal('default value', Cache.get('cached'));
    })
  });
});
