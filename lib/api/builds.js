"use strict";

var buildsEndpoints = require("../endpoints/builds")
  ;

var Builds = function(request) {
  this._request = request;
};
module.exports = Builds;

Builds.prototype.get = function (locator) {
  return  this._request.execute(buildsEndpoints.getBuildById, {locator: locator});
};

Builds.prototype.getBuildPropertiesById = function (locator) {
  return this._request.execute(buildsEndpoints.getBuildPropertiesById, {locator: locator});
};

Builds.prototype.getByBuildTypeWithCount = function (locator, count) {
    return this._request.execute(buildsEndpoints.getBuildsByBuildTypeWithCount, {locator: locator, count: count});
};

Builds.prototype.getByProjectWithCount = function (project, count) {
    return this._request.execute(buildsEndpoints.getBuildsByProjectWithCount, { project: project, count: count});
};

Builds.prototype.startBuild = function (buildNode) {
    return this._request.execute(buildsEndpoints.startBuild, buildNode);
};

