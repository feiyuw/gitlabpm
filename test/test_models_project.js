var proxyquire = require('proxyquire');
var assert = require('assert');
var rpcStub = {};
var Project = proxyquire('../models/project', {'./rpc': rpcStub});
var Cache = require('../models/cache');

var _ownedProjects = [{"id":11,"description":"","default_branch":"master","public":true,"archived":false,"visibility_level":20,"ssh_url_to_repo":"git@becrtt01.china.nsn-net.net:platformci/fd.git","http_url_to_repo":"http://becrtt01.china.nsn-net.net/platformci/fd.git","web_url":"http://becrtt01.china.nsn-net.net/platformci/fd","name":"fd","name_with_namespace":"PlatformCI / fd","path":"fd","path_with_namespace":"platformci/fd","issues_enabled":true,"merge_requests_enabled":true,"wiki_enabled":false,"snippets_enabled":false,"created_at":"2013-11-05T05:57:58.000Z","last_activity_at":"2014-09-03T08:11:22.000Z","namespace":{"id":12,"name":"PlatformCI","path":"platformci","owner_id":null,"created_at":"2013-11-04T05:15:06.000Z","updated_at":"2013-11-04T05:15:06.000Z","description":"","avatar":{"url":null}}},
{"id":18,"description":"","default_branch":"master","public":true,"archived":false,"visibility_level":20,"ssh_url_to_repo":"git@becrtt01.china.nsn-net.net:platformci/tepproxy.git","http_url_to_repo":"http://becrtt01.china.nsn-net.net/platformci/tepproxy.git","web_url":"http://becrtt01.china.nsn-net.net/platformci/tepproxy","name":"TepProxy","name_with_namespace":"PlatformCI / TepProxy","path":"tepproxy","path_with_namespace":"platformci/tepproxy","issues_enabled":true,"merge_requests_enabled":true,"wiki_enabled":false,"snippets_enabled":false,"created_at":"2013-11-26T06:38:02.000Z","last_activity_at":"2014-09-03T08:11:02.000Z","namespace":{"id":12,"name":"PlatformCI","path":"platformci","owner_id":null,"created_at":"2013-11-04T05:15:06.000Z","updated_at":"2013-11-04T05:15:06.000Z","description":"","avatar":{"url":null}}}];

var _allProjects = _ownedProjects.concat([{"id":30,"description":"","default_branch":"master","public":true,"archived":false,"visibility_level":20,"ssh_url_to_repo":"git@becrtt01.china.nsn-net.net:platformci/dlock.git","http_url_to_repo":"http://becrtt01.china.nsn-net.net/platformci/dlock.git","web_url":"http://becrtt01.china.nsn-net.net/platformci/dlock","name":"dlock","name_with_namespace":"PlatformCI / dlock","path":"dlock","path_with_namespace":"platformci/dlock","issues_enabled":true,"merge_requests_enabled":true,"wiki_enabled":false,"snippets_enabled":false,"created_at":"2013-11-29T03:55:36.000Z","last_activity_at":"2014-09-03T08:10:58.000Z","namespace":{"id":12,"name":"PlatformCI","path":"platformci","owner_id":null,"created_at":"2013-11-04T05:15:06.000Z","updated_at":"2013-11-04T05:15:06.000Z","description":"","avatar":{"url":null}}}]);

rpcStub.get = function(apiStr, callback) {
  switch(apiStr) {
    case '/projects/owned':
      callback(_ownedProjects);
      break;
    case '/projects':
      callback(_allProjects);
      break;
  }
}

describe('Project', function() {
  beforeEach(function(done) {
    Cache.reset();
    done();
  });

  describe('#allOwned', function() {
    it('should return all owned projects', function(done) {
      Project.allOwned(function(projects) {
        assert.equal(projects.length, 2);
        done();
      });
    })
  });

  describe('#all', function() {
    it('should return all projects', function(done) {
      Project.all(function(projects) {
        assert.equal(projects.length, 3);
        done();
      });
    })
  });
});
