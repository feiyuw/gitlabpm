// UT module for MileStone
var proxyquire = require('proxyquire');
var assert = require('assert');
var rpcStub = {};
var projectStub = {};
var MileStone = proxyquire('../models/ms', {'./rpc': rpcStub});
var Cache = require('../models/cache');


var _mileStones = [
{"id":2,"iid":1,"project_id":11,"title":"sprint14082","description":"","state":"active","created_at":"2013-12-03T02:59:12.000Z","updated_at":"2014-09-11T03:07:18.000Z","due_date":"2014-08-15"},
{"id":6,"iid":2,"project_id":11,"title":"sprint14101","description":null,"state":"active","created_at":"2014-09-02T07:45:55.000Z","updated_at":"2014-09-02T07:45:55.000Z","due_date":"2014-09-26"}];

// mock rpc
rpcStub.get = function(apiStr, callback) {
  callback(_mileStones);
}

var _newMileStone = {"id":25,"iid":3,"project_id":11,"title":"sprint14102","description":"","state":"active","created_at":"2014-09-02T07:48:26.000Z","updated_at":"2014-09-11T03:07:56.000Z","due_date":"2014-10-10"};

rpcStub.post = function(apiStr, postData, callback) {
  callback(_newMileStone);
}


describe('MileStone', function() {
  beforeEach(function(done) {
    Cache.reset();
    done();
  });

  describe('#getOrCreate(get)', function() {
    it('should return matched milestone', function(done) {
      MileStone.getOrCreate(11, 'sprint14101', '2014-09-26', function(mileStone) {
        assert.equal(mileStone.title, 'sprint14101');
        done();
      });
    })
  });

  describe('#getOrCreate(create)', function() {
    it('should create new milestone if not exist', function(done) {
      MileStone.getOrCreate(11, 'sprint14102', '2014-10-10', function(mileStone) {
        assert.equal(mileStone.title, 'sprint14102');
        assert.equal(mileStone.due_date, '2014-10-10');
        done();
      });
    })
  });
})
