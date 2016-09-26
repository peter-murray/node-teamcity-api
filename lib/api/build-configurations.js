"use strict";

var buildConfigurationEndpoints = require("../endpoints/build-configuration")
  ;

var BuildConfigurations = function(request) {
  this._request = request;
};
module.exports = BuildConfigurations;

BuildConfigurations.prototype.get = function (locator) {
  return  this._request.execute(buildConfigurationEndpoints.getBuildConfiguration, {locator: locator});
};

BuildConfigurations.prototype.pause = function (locator) {
  return pauseBuildConfiguration(this._request, locator, true);
};

BuildConfigurations.prototype.unpause = function (locator) {
  return pauseBuildConfiguration(this._request, locator, false);
};

BuildConfigurations.prototype.isPaused = function (locator) {
  return this._request.execute(buildConfigurationEndpoints.isPaused, {locator: locator});
};

BuildConfigurations.prototype.delete = function(locator) {
  return this._request.execute(buildConfigurationEndpoints.deleteBuildConfiguration, {locator: locator});
};

BuildConfigurations.prototype.attachVcsRoot = function (buildLocator, vcsRootId) {
  return this._request.execute(buildConfigurationEndpoints.addVcsRoot, {locator: buildLocator, id: vcsRootId});
};

BuildConfigurations.prototype.detachVcsRoot = function (locator, vcsRootId) {
  return this._request.execute(buildConfigurationEndpoints.removeVcsRoot, {locator: locator, vcsRootIdLocator: vcsRootId});
};

BuildConfigurations.prototype.getVcsRoots = function (locator) {
  return this._request.execute(buildConfigurationEndpoints.getVcsRoots, {locator: locator});
};

BuildConfigurations.prototype.getAttachedTemplate = function(locator) {
  return this._request.execute(buildConfigurationEndpoints.getTemplateAssociation, {locator: locator});
};

BuildConfigurations.prototype.attachTemplate = function(locator, templateLocator) {
  return this._request.execute(buildConfigurationEndpoints.setTemplateAssociation, {locator: locator, templateId: templateLocator});
};

BuildConfigurations.prototype.detachTemplate = function(locator) {
  return this._request.execute(buildConfigurationEndpoints.deleteTemplateAssociation, {locator: locator});
};

BuildConfigurations.prototype.getSteps = function(locator) {
  return this._request.execute(buildConfigurationEndpoints.getSteps, {locator:locator});
};

BuildConfigurations.prototype.deleteSteps = function(locator) {
  //TODO
};

BuildConfigurations.prototype.deleteAllParameters = function(locator) {
  //TODO
};

BuildConfigurations.prototype.deleteParameter = function(locator, parameter) {
  //TODO
};

BuildConfigurations.prototype.getArtifactDependencies = function (locator) {
  return this._request.execute(buildConfigurationEndpoints.getArtifactDependencies, {locator: locator});
};

BuildConfigurations.prototype.setArtifactDependencies = function(locator, dependencies) {
  return this._request.execute(buildConfigurationEndpoints.setArtifactDependencies, {locator: locator, dependencies: dependencies});
};

function pauseBuildConfiguration(request, locator, pause) {
  return request.execute(buildConfigurationEndpoints.pause, {locator: locator, paused: pause});
}