"use strict";

var projectEndpoints = require("../endpoints/projects")
  , constants = require("../constants")
  ;


var Projects = function(request) {
  this._request = request;
};
module.exports = Projects;

Projects.prototype.getAll = function () {
  return this._request.execute(projectEndpoints.projects);
};

Projects.prototype.get = function (locator) {
  return this._request.execute(projectEndpoints.project, {locator: locator});
};

Projects.prototype.create = function (name, parentId) {
  return this._request.execute(projectEndpoints.createProject, {name: name, parentId: parentId || constants.ROOT_PROJECT_LOCATOR.id})
};

Projects.prototype.copy = function (name, id, sourceId, parentId, copyAllSettings) {
  return this._request.execute(projectEndpoints.copyProject,
    {
      name: name,
      id: id,
      sourceId: sourceId,
      parentId: parentId || constants.ROOT_PROJECT_LOCATOR.id,
      sourceId: sourceId,
      copyAllSettings: (typeof copyAllSettings !== 'undefined' ? copyAllSettings : true)
    })
};

Projects.prototype.setParameter = function (locator, name, value) {
  return this._request.execute(projectEndpoints.setParameter, {locator: locator, name: name, value: value});
};

Projects.prototype.setParameters = function (locator, parameters) {
  if (!Array.isArray(parameters)) {
    throw new Error("The parameters must be an array or {name, value} objects");
  }

  return this._request.execute(projectEndpoints.setParameters, {locator: locator, parameters});
};

Projects.prototype.getParameters = function (locator) {
  return this._request.execute(projectEndpoints.getParameters, {locator: locator});
};

Projects.prototype.deleteAllParameters = function (locator) {
  return this._request.execute(projectEndpoints.deleteAllParameters, {locator: locator});
};

Projects.prototype.move = function (locator, newParent) {
  return this._request.execute(projectEndpoints.moveProject, {locator: locator, parent: newParent});
};

Projects.prototype.createBuildTemplate = function (locator, templateName) {
  return this._request.execute(projectEndpoints.createBuildTemplate, {locator: locator, name: templateName});
};

Projects.prototype.getBuildTemplates = function (locator) {
  return this._request.execute(projectEndpoints.getBuildTemplates, {locator: locator || constants.ROOT_PROJECT_LOCATOR});
};

Projects.prototype.createBuildConfiguration = function (locator, buildName) {
  if (!buildName) {
    throw new Error("A BuildConfiguration name must be provided.");
  }

  if (locator && (locator.id == constants.ROOT_PROJECT_LOCATOR.id || locator.name == "Root project")) {
    throw new Error("Cannot create a Build Configuration under the Root Project");
  }

  return this._request.execute(projectEndpoints.createBuildConfiguration, {locator: locator, name: buildName})
};

Projects.prototype.delete = function (locator) {
  if (!locator) {
    throw new Error("A Project locator must be provided");
  }

  return this._request.execute(projectEndpoints.deleteProject, {locator: locator})
};

