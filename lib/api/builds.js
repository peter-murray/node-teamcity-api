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

Builds.prototype.getWithCount = function (locator, count) {
    return this._request.execute(buildsEndpoints.getBuildsWithCount, {locator: locator, count: count});
};

