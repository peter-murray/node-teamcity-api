"use strict";

var vcsRootEndpoints = require("../endpoints/vcs-roots")
  , constants = require("../constants")
  ;

var VcsRoots = function(request) {
  this._request = request;
};
module.exports = VcsRoots;

VcsRoots.prototype.getAll = function () {
  var self = this
    , request = self._request
    ;

  return request.execute(vcsRootEndpoints.get);
};

VcsRoots.prototype.get = function (id) {
  var self = this
    , request = self._request
    ;

  return request.execute(vcsRootEndpoints.getVcsRoot, {locator: id});
};

VcsRoots.prototype.create = function (vcsRootDetails, projectId) {
  var self = this
    , request = self._request
    ;

  return request.execute(vcsRootEndpoints.create, {
    projectId: projectId || constants.ROOT_PROJECT_LOCATOR.id,
    vcsRoot: vcsRootDetails
  });
};

VcsRoots.prototype.delete = function (id) {
  var self = this
    , request = self._request
    ;

  return request.execute(vcsRootEndpoints.deleteVcsRoot, {locator: {id: id}});
};

VcsRoots.prototype.createGit = function (url, projectId) {
  var self = this;
  //TODO need to cater for permutations
  return self.createGitVcsRoot(vcsRootDetails, projectId);
};
