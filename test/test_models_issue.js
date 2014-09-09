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

rpcStub.get = function(apiStr, callback) {
  switch(apiStr) {
    case '/projects/11/issues':
      callback(_project11Issues);
      break;
    case '/projects/18/issues':
      callback(_project18Issues);
      break;
  }
}

var _updatedIssue = {"id":11,"iid":6,"project_id":11,"title":"add chat option between users connected to the same device","state":"opened","created_at":"2013-11-26T08:53:02.000Z","updated_at":"2014-09-02T07:08:12.000Z","labels":["improvement"],"milestone":{"id":15,"iid":2,"project_id":49,"title":"sprint14101","description":null,"state":"active","created_at":"2014-09-02T07:46:21.000Z","updated_at":"2014-09-02T07:46:21.000Z","due_date":"2014-09-26"},"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}}
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
      Issue.edit(11, 11, 15, function(issue) {
        assert.equal(issue.sprint, 'sprint14101');
        assert.equal(Cache.getIssues()[0].sprint, 'sprint14101');
        done();
      });
    });
  });
});
