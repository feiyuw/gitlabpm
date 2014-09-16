var proxyquire = require('proxyquire');
var assert = require('assert');
var rpcStub = {};
var projectStub = {};
var issueStub = {};
var milestoneStub = {};
var Sprint = proxyquire('../models/sprint', {'./project': projectStub, './issue': issueStub, './ms': milestoneStub});
var Issue = proxyquire('../models/issue', {'./rpc': rpcStub, './project': projectStub});
var Cache = require('../models/cache');


// mock rpc
var _project11Issues = [{"id":11,"iid":6,"project_id":11,"title":"add chat option between users connected to the same device","state":"opened","created_at":"2013-11-26T08:53:02.000Z","updated_at":"2014-09-02T07:08:12.000Z","labels":["improvement"],"milestone":{"id":2,"iid":1,"project_id":11,"title":"sprint14092","description":"sprint 14092","state":"active","created_at":"2013-12-03T02:59:12.000Z","updated_at":"2014-09-02T01:34:44.000Z","due_date":"2014-09-12"},"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}},
  {"id":10,"iid":5,"project_id":11,"title":"record \u0026 replay support","description":"add support to record and replay for fdframework","state":"opened","created_at":"2013-11-26T08:49:18.000Z","updated_at":"2013-11-26T08:49:18.000Z","labels":["improvement"],"milestone":{"id":6,"iid":2,"project_id":11,"title":"sprint14101","description":null,"state":"active","created_at":"2014-09-02T07:45:55.000Z","updated_at":"2014-09-02T07:45:55.000Z","due_date":"2014-09-26"},"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}}]

var _project18Issues = [{"id":9,"iid":4,"project_id":18,"title":"proxy mode support","description":"add proxy mode, use fd as a proxy between client and real device","state":"opened","created_at":"2013-11-26T08:48:52.000Z","updated_at":"2013-11-26T08:48:52.000Z","labels":["improvement"],"milestone":null,"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}}];

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

// mock Project
var _ownedProjects = [{"id":11,"web_url":"http://becrtt01.china.nsn-net.net/platformci/fd","name":"fd","name_with_namespace":"PlatformCI / fd","path":"fd","path_with_namespace":"platformci/fd","created_at":"2013-11-05T05:57:58.000Z"},
{"id":18,"web_url":"http://becrtt01.china.nsn-net.net/platformci/tepproxy","name":"TepProxy","name_with_namespace":"PlatformCI / TepProxy","path":"tepproxy","path_with_namespace":"platformci/tepproxy","created_at":"2013-11-26T06:38:02.000Z"}];

projectStub.allOwned = function(callback) {
  callback(_ownedProjects);
}

// mock Issue
var _issues = [{"id":11,"iid":6,"project_id":11,"title":"add chat option between users connected to the same device","state":"opened","created_at":"2013-11-26T08:53:02.000Z","updated_at":"2014-09-02T07:08:12.000Z","labels":["improvement"],"milestone":{"id":2,"iid":1,"project_id":11,"title":"sprint14092","description":"sprint 14092","state":"active","created_at":"2013-12-03T02:59:12.000Z","updated_at":"2014-09-02T01:34:44.000Z","due_date":"2014-09-12"},"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}},
  {"id":10,"iid":5,"project_id":11,"title":"record \u0026 replay support","description":"add support to record and replay for fdframework","state":"opened","created_at":"2013-11-26T08:49:18.000Z","updated_at":"2013-11-26T08:49:18.000Z","labels":["improvement"],"milestone":{"id":6,"iid":2,"project_id":11,"title":"sprint14101","description":null,"state":"active","created_at":"2014-09-02T07:45:55.000Z","updated_at":"2014-09-02T07:45:55.000Z","due_date":"2014-09-26"},"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}},
  {"id":9,"iid":4,"project_id":18,"title":"proxy mode support","description":"add proxy mode, use fd as a proxy between client and real device","state":"opened","created_at":"2013-11-26T08:48:52.000Z","updated_at":"2013-11-26T08:48:52.000Z","labels":["improvement"],"milestone":null,"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}}];

var _updatedIssues = _issues.concat([{"id":19,"iid":14,"project_id":18,"title":"","description":"","state":"opened","created_at":"2013-11-26T08:48:52.000Z","updated_at":"2013-11-26T08:48:52.000Z","labels":["new"],"milestone":{"id":8,"iid":4,"project_id":18,"title":"sprint14102","description":null,"state":"active","created_at":"2014-09-02T07:45:55.000Z","updated_at":"2014-09-02T07:45:55.000Z","due_date":"2014-10-10"},"assignee":null,"author":{"name":"Zhang Yu","username":"yu.3.zhang","id":11,"state":"active"}}]);

issueStub.all = function(callback) {
  callback(_issues);
}


// mock MileStone
var _milestones = {11: [{"id":2,"iid":1,"project_id":11,"title":"sprint14092","description":"sprint 14092","state":"active","created_at":"2013-12-03T02:59:12.000Z","updated_at":"2014-09-02T01:34:44.000Z","due_date":"2014-09-12"},
  {"id":6,"iid":2,"project_id":11,"title":"sprint14101","description":null,"state":"active","created_at":"2014-09-02T07:45:55.000Z","updated_at":"2014-09-02T07:45:55.000Z","due_date":"2014-09-26"}],
18: [{"id":45,"iid":3,"project_id":18,"title":"sprint14101","description":null,"state":"active","created_at":"2014-09-02T07:50:25.000Z","updated_at":"2014-09-02T07:50:25.000Z","due_date":"2014-09-26"},
  {"id":64,"iid":4,"project_id":18,"title":"sprint14102","description":null,"state":"active","created_at":"2014-09-03T08:04:15.000Z","updated_at":"2014-09-03T08:04:15.000Z","due_date":"2014-10-10"}]};

milestoneStub.projectAll = function(projectId, callback) {
  callback(_milestones[projectId]);
}


describe('Sprint', function() {
  beforeEach(function(done) {
    Cache.reset();
    done();
  });

  describe('#all', function() {
    it('should return all sprints of owned projects', function(done) {
      Sprint.all(function(sprints) {
        assert.equal(sprints.length, 4);
        done();
      });
    })
  });

  describe('#all(after Issue#all)', function() {
    it('should return all sprints after fetched Issue.all', function(done){
      Issue.all(function(issues) {
        Sprint.all(function(sprints) {
          assert.equal(sprints.length, 4);
          done();
        });
      });
    });
  });

  describe('#update', function() {
    it('should update all sprints when issues update', function(done) {
      Sprint.update(_updatedIssues, function(sprints) {
        assert.equal(sprints.length, 5);
        done();
      });
    });
  });

  describe('#current', function() {
    it('should return the current sprint', function(done) {
      Sprint.current(function(currentSprint) {
        assert.equal(currentSprint.name, 'sprint14101');
        done();
      });
    });
  });
});
