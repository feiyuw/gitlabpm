var proxyquire = require('proxyquire');
var assert = require('assert');
var rpcStub = {};
var projectStub = {};
var Issue = proxyquire('../models/issue', {'./rpc': rpcStub, './project': projectStub});
var Cache = require('../models/cache');


// mock rpc
var _project11Issues = [{"id":11,"iid":6,"project_id":11,"title":"add chat option between users connected to the same device","state":"opened","created_at":"2013-11-26T08:53:02.000Z","updated_at":"2014-09-02T07:08:12.000Z","labels":["improvement"],"milestone":null,"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}},
{"id":10,"iid":5,"project_id":11,"title":"record \u0026 replay support","description":"add support to record and replay for fdframework","state":"opened","created_at":"2013-11-26T08:49:18.000Z","updated_at":"2013-11-26T08:49:18.000Z","labels":["improvement"],"milestone":null,"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}}]

var _project18Issues = [{"id":9,"iid":4,"project_id":18,"title":"proxy mode support","description":"add proxy mode, use fd as a proxy between client and real device","state":"opened","created_at":"2013-11-26T08:48:52.000Z","updated_at":"2013-11-26T08:48:52.000Z","labels":["improvement"],"milestone":null,"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}}]

var _hookUpdateIssue = {"id":11,"iid":6,"project_id":11,"title":"add chat option between users connected to the same device","state":"opened","created_at":"2013-11-26 08:53:02 UTC","updated_at":"2014-09-02 07:08:12 UTC","milestone_id":15,"assignee_id":null,"author_id":11,"position":0}

var _hookNewIssue = {"id":4,"iid":2,"project_id":11,"title":"fix stop hung problem","description":"when open two server instances, and do some operation, it will fail to stop the server, see the ut result for detail","state":"closed","created_at":"2013-11-26 06:47:23 UTC","updated_at":"2014-09-02 01:28:38 UTC","milestone_id":null,"assignee_id":null,"author_id":22,"position":0}

var _updatedIssue = {"id":11,"iid":6,"project_id":11,"title":"add chat option between users connected to the same device","state":"opened","created_at":"2013-11-26T08:53:02.000Z","updated_at":"2014-09-02T07:08:12.000Z","labels":["improvement"],"milestone":{"id":15,"iid":2,"project_id":49,"title":"sprint14101","description":null,"state":"active","created_at":"2014-09-02T07:46:21.000Z","updated_at":"2014-09-02T07:46:21.000Z","due_date":"2014-09-26"},"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}}

var _newIssue = {"id":4,"iid":2,"project_id":11,"title":"fix stop hung problem","description":"when open two server instances, and do some operation, it will fail to stop the server, see the ut result for detail","state":"closed","created_at":"2013-11-26T06:47:23.000Z","updated_at":"2014-09-02T01:28:38.000Z","labels":["bug"],"milestone":null,"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}}

rpcStub.get = function(apiStr, callback) {
  switch(apiStr) {
    case '/projects/11/issues':
      callback(_project11Issues);
      break;
    case '/projects/18/issues':
      callback(_project18Issues);
      break;
    case '/projects/11/issues/11':
      callback(_updatedIssue);
      break;
    case '/projects/11/issues/4':
      callback(_newIssue);
      break;
  }
}


rpcStub.put = function(reqStr, reqData, callback) {
  switch(reqStr) {
    case '/projects/11/issues/11':
      callback(_updatedIssue);
      break;
  }
}


// mock Project
var _ownedProjects = [{"id":11,"web_url":"http://becrtt01.china.nsn-net.net/platformci/fd","name":"fd","name_with_namespace":"PlatformCI / fd","path":"fd","path_with_namespace":"platformci/fd","created_at":"2013-11-05T05:57:58.000Z"},
{"id":18,"web_url":"http://becrtt01.china.nsn-net.net/platformci/tepproxy","name":"TepProxy","name_with_namespace":"PlatformCI / TepProxy","path":"tepproxy","path_with_namespace":"platformci/tepproxy","created_at":"2013-11-26T06:38:02.000Z"}];


projectStub.allOwned = function(callback) {
  callback(_ownedProjects);
}

projectStub.get = function(projectId, callback) {
  callback(_ownedProjects[0]);
}


describe('Issue', function() {
  beforeEach(function(done) {
    Cache.reset();
    done();
  });

  describe('#all', function() {
    it('should return all issues of owned projects', function(done) {
      Issue.all(function(issues) {
        assert.equal(issues.length, 3);
        assert.equal(issues[0].project, 'fd');
        assert.equal(issues[0].projectUrl, 'http://becrtt01.china.nsn-net.net/platformci/fd');
        assert.equal(issues[1].project, 'fd');
        assert.equal(issues[1].projectUrl, 'http://becrtt01.china.nsn-net.net/platformci/fd');
        assert.equal(issues[2].project, 'TepProxy');
        assert.equal(issues[2].projectUrl, 'http://becrtt01.china.nsn-net.net/platformci/tepproxy');
        done();
      });
    })
  });

  describe('#edit', function() {
    it('should update the sprint of issue', function(done) {
      Issue.edit(11, 15, function(issue) {
        assert.equal(issue.milestone.title, 'sprint14101');
        done();
      });
    });
  });

  describe('#update', function() {
    it('should update the issue when issue exist', function(done) {
      Issue.update(_hookUpdateIssue, function(issues) {
        assert.equal(issues[0].milestone.title, 'sprint14101');
        assert.equal(Cache.getIssues()[0].milestone.title, 'sprint14101');
        done();
      });
    });
  });

  describe('#update(insert)', function() {
    it('should insert the issue when issue does not exist', function(done) {
      Issue.update(_hookNewIssue, function(issues) {
        assert.equal(issues.length, 4);
        assert.equal(Cache.getIssues().length, 4);
        done();
      });
    });
  });
})
