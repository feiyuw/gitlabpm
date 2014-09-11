var proxyquire = require('proxyquire');
var assert = require('assert');
var rpcStub = {};
var projectStub = {};
var MergeRequest = proxyquire('../models/mr', {'./rpc': rpcStub, './project': projectStub});
var Cache = require('../models/cache');


var _project11Mrs = [{"id":570,"iid":159,"project_id":11,"title":"Switch","description":"","state":"opened","created_at":"2014-09-10T08:39:23.000Z","updated_at":"2014-09-11T03:59:09.000Z","target_branch":"master","source_branch":"switch","upvotes":0,"downvotes":0,"author":{"name":"Wu Minxiao","username":"shawn.wu","id":19,"state":"active","avatar_url":"http://www.gravatar.com/avatar/15d626d327deb30deff42f9b56922270?s=40\u0026d=identicon"},"assignee":null,"source_project_id":11,"target_project_id":11,"labels":[]}];
var _project18Mrs = [{"id":528,"iid":44,"project_id":18,"title":"Switch","description":"","state":"opened","created_at":"2014-08-25T08:34:10.000Z","updated_at":"2014-09-11T02:45:31.000Z","target_branch":"master","source_branch":"switch","upvotes":0,"downvotes":0,"author":{"name":"Wu Minxiao","username":"shawn.wu","id":19,"state":"active","avatar_url":"http://www.gravatar.com/avatar/15d626d327deb30deff42f9b56922270?s=40\u0026d=identicon"},"assignee":null,"source_project_id":18,"target_project_id":18,"labels":[]}];

// mock rpc
rpcStub.get = function(apiStr, callback) {
  switch(apiStr) {
    case '/projects/11/merge_requests?state=opened':
      callback(_project11Mrs);
      break;
    case '/projects/18/merge_requests?state=opened':
      callback(_project18Mrs);
      break;
    case '/projects/11/merge_requests/132':
      callback(_newMergeRequest);
      break;
    case '/projects/11/merge_requests/570':
      if (process.env._UT_ACTION == "merged") {
        callback(_mergedMergeRequest);
      } else if (process.env._UT_ACTION == "closed") {
        callback(_closedMergeRequest);
      } else {
        callback(_updateMergeRequest);
      }
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


// new merge request data
var _hookUpdateMergeRequest = {"id":570,"iid":159,"project_id":11,"title":"Switch","description":"support ngplatform package switching","state":"opened","created_at":"2014-09-10 08:39:23 UTC","updated_at":"2014-09-11 03:59:09 UTC","target_branch":"master","source_branch":"switch","author_id":19,"assignee_id":null,"source_project_id":11,"target_project_id":11,"st_committs":[],"st_diffs":[],"merge_status":"unchecked","milestone_id":null}
var _updateMergeRequest = {"id":570,"iid":159,"project_id":11,"title":"Switch","description":"support ngplatform package switching","state":"opened","created_at":"2014-09-10T08:39:23.000Z","updated_at":"2014-09-11T03:59:09.000Z","target_branch":"master","source_branch":"switch","upvotes":1,"downvotes":0,"author":{"name":"Wu Minxiao","username":"shawn.wu","id":19,"state":"active","avatar_url":"http://www.gravatar.com/avatar/15d626d327deb30deff42f9b56922270?s=40\u0026d=identicon"},"assignee":null,"source_project_id":11,"target_project_id":11,"labels":[]}

var _hookNewMergeRequest = {"id":132,"iid":15,"project_id":11,"title":"oamcci","description":"","state":"opened","created_at":"2014-04-21 08:00:59 UTC","updated_at":"2014-09-01 09:28:56 UTC","target_branch":"master","source_branch":"oamcci","author_id":19,"assignee_id":null,"source_project_id":11,"target_project_id":11,"st_committs":[],"st_diffs":[],"merge_status":"unchecked","milestone_id":null}

var _newMergeRequest = {"id":132,"iid":15,"project_id":11,"title":"Oamcci","description":"","state":"opened","created_at":"2014-04-21T08:00:59.000Z","updated_at":"2014-09-01T09:28:56.000Z","target_branch":"master","source_branch":"oamcci","upvotes":0,"downvotes":0,"author":{"name":"Wu Minxiao","username":"shawn.wu","id":19,"state":"active","avatar_url":"http://www.gravatar.com/avatar/15d626d327deb30deff42f9b56922270?s=40\u0026d=identicon"},"assignee":null,"source_project_id":11,"target_project_id":11,"labels":[]}

var _hookMergedMergeRequest = {"id":570,"iid":159,"project_id":11,"title":"Switch","description":"support ngplatform package switching","state":"merged","created_at":"2014-09-10 08:39:23 UTC","updated_at":"2014-09-11 03:59:09 UTC","target_branch":"master","source_branch":"switch","author_id":19,"assignee_id":null,"source_project_id":11,"target_project_id":11,"st_committs":[],"st_diffs":[],"merge_status":"unchecked","milestone_id":null}
var _mergedMergeRequest = {"id":570,"iid":159,"project_id":11,"title":"Switch","description":"support ngplatform package switching","state":"merged","created_at":"2014-09-10T08:39:23.000Z","updated_at":"2014-09-11T03:59:09.000Z","target_branch":"master","source_branch":"switch","upvotes":1,"downvotes":0,"author":{"name":"Wu Minxiao","username":"shawn.wu","id":19,"state":"active","avatar_url":"http://www.gravatar.com/avatar/15d626d327deb30deff42f9b56922270?s=40\u0026d=identicon"},"assignee":null,"source_project_id":11,"target_project_id":11,"labels":[]}

var _hookClosedMergeRequest = {"id":570,"iid":159,"project_id":11,"title":"Switch","description":"support ngplatform package switching","state":"closed","created_at":"2014-09-10 08:39:23 UTC","updated_at":"2014-09-11 03:59:09 UTC","target_branch":"master","source_branch":"switch","author_id":19,"assignee_id":null,"source_project_id":11,"target_project_id":11,"st_committs":[],"st_diffs":[],"merge_status":"unchecked","milestone_id":null}
var _closedMergeRequest = {"id":570,"iid":159,"project_id":11,"title":"Switch","description":"support ngplatform package switching","state":"closed","created_at":"2014-09-10T08:39:23.000Z","updated_at":"2014-09-11T03:59:09.000Z","target_branch":"master","source_branch":"switch","upvotes":1,"downvotes":0,"author":{"name":"Wu Minxiao","username":"shawn.wu","id":19,"state":"active","avatar_url":"http://www.gravatar.com/avatar/15d626d327deb30deff42f9b56922270?s=40\u0026d=identicon"},"assignee":null,"source_project_id":11,"target_project_id":11,"labels":[]}


describe('MergeRequest', function() {
  beforeEach(function(done) {
    Cache.reset();
    done();
  });

  describe('#openAll', function() {
    it('should return all opened merge requests of owned projects', function(done) {
      MergeRequest.openAll(function(mergeRequests) {
        assert.equal(mergeRequests.length, 2);
        assert.equal(mergeRequests[0].project, 'fd');
        done();
      });
    })
  });

  describe('#update', function() {
    it('should update the merge request opened and exist', function(done) {
      process.env._UT_ACTION = "update";
      MergeRequest.update(_hookUpdateMergeRequest, function(mergeRequests) {
        assert.equal(mergeRequests[0].upvotes, 1);
        assert.equal(mergeRequests[0].project, 'fd');
        done();
      });
    });
  });

  describe('#update(insert)', function() {
    it('should add the merge request not exist', function(done) {
      process.env._UT_ACTION = "insert";
      MergeRequest.update(_hookNewMergeRequest, function(mergeRequests) {
        assert.equal(mergeRequests.length, 3);
        done();
      });
    });
  });

  describe('#update(merged)', function() {
    it('should remove the merge request that merged', function(done) {
      process.env._UT_ACTION = "merged";
      MergeRequest.update(_hookMergedMergeRequest, function(mergeRequests) {
        assert.equal(mergeRequests.length, 1);
        assert.equal(mergeRequests[0].id, 528);
        assert.equal(mergeRequests[0].project, 'TepProxy');
        done();
      });
    });
  });

  describe('#update(closed)', function() {
    it('should remove the merge request that closed', function(done) {
      process.env._UT_ACTION = "closed";
      MergeRequest.update(_hookClosedMergeRequest, function(mergeRequests) {
        assert.equal(mergeRequests.length, 1);
        assert.equal(mergeRequests[0].id, 528);
        assert.equal(mergeRequests[0].project, 'TepProxy');
        done();
      });
    });
  });
})
