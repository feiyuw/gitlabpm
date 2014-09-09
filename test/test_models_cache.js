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

  describe('#updateIssue', function() {
    it('should update the specified issue when the new issue is given', function() {
      Cache.setIssues([{"id":1,"iid":1,"project_id":1,"title":"ut","description":"ut","state":"opened","labels":["improvement"],"milestone":null,"assignee":null}]);
      Cache.updateIssue({"id":1,"iid":1,"project_id":1,"title":"ut","description":"ut","state":"opened","labels":["improvement"],"milestone":{"id":15,"iid":2,"project_id":49,"title":"sprint14101","description":null,"state":"active","due_date":"2014-09-26"},"assignee":null});
      assert.notEqual(null, Cache.getIssues()[0].milestone);
    })
  });
});
