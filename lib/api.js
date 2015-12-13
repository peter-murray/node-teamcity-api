"use strict";

var util = require("util")
  , request = require("./request")
  , hostEndpoints = require("./endpoints/host")
  , projectEndpoints = require("./endpoints/projects")
  , buildConfigurationEndpoints = require("./endpoints/build-configuration")
  , vcsRootEndpoints = require("./endpoints/vcs-roots")
  ;

const CONFIG_PARAMETERS = ["hostname", "port", "protocol"]
  , ROOT_PROJECT_LOCATOR = {id: "_Root"}
  ;

var TeamCityAPI = function (config) {
  var apiConfig = {}
    ;

  if (!config) {
    throw new Error("A configuration object or string must be provided");
  }

  if (typeof(config) === "string") {
    loadParametersFromUrl(config, apiConfig);
  } else if (config.url) {
    loadParametersFromUrl(config.url, apiConfig);
    setAuthentication(config, apiConfig);
  } else {
    CONFIG_PARAMETERS.forEach(function (param) {
      apiConfig[param] = config[param];
    });
    setAuthentication(config, apiConfig);
  }

  setPort(apiConfig);

  CONFIG_PARAMETERS.forEach(function (param) {
    if (!apiConfig[param]) {
      throw new Error(util.format("Required parameter '%s' was not provided", param));
    }
  });

  this._config = apiConfig;
  this._request = request.create(apiConfig);
};
module.exports = TeamCityAPI;


TeamCityAPI.prototype.getVersion = function () {
  var self = this
    , request = self._request
    ;

  return request.execute(hostEndpoints.version);
};

TeamCityAPI.prototype.getApiVersion = function () {
  var self = this
    , request = self._request
    ;

  return request.execute(hostEndpoints.apiVersion);
};

TeamCityAPI.prototype.getProjects = function () {
  var self = this
    , request = self._request
    ;

  return request.execute(projectEndpoints.projects);
};

TeamCityAPI.prototype.getProject = function (locator) {
  var self = this
    , request = self._request
    ;

  return request.execute(projectEndpoints.project, {locator: locator});
};

TeamCityAPI.prototype.createProject = function (name, parentId) {
  var self = this
    , request = self._request
    ;

  return request.execute(projectEndpoints.createProject, {name: name, parentId: parentId || ROOT_PROJECT_LOCATOR.id})
};

TeamCityAPI.prototype.setProjectParameter = function (locator, name, value) {
  var self = this
    , request = self._request
    ;

  return request.execute(projectEndpoints.setParameter, {locator: locator, name: name, value: value});
};

TeamCityAPI.prototype.setProjectParameters = function (locator, parameters) {
  var self = this
    , request = self._request
    ;

  if (!Array.isArray(parameters)) {
    throw new Error("The parameters must be an array or {name, value} objects");
  }

  return request.execute(projectEndpoints.setParameters, {locator: locator, parameters});
};

TeamCityAPI.prototype.getProjectParameters = function (locator) {
  var self = this
    , request = self._request
    ;

  return request.execute(projectEndpoints.getParameters, {locator: locator});
};

TeamCityAPI.prototype.deleteAllProjectParameters = function (locator) {
  var self = this
    , request = self._request
    ;

  return request.execute(projectEndpoints.deleteAllParameters, {locator: locator});
};

TeamCityAPI.prototype.getBuildConfiguration = function (locator) {
  var self = this
    , request = self._request
    ;

  return request.execute(buildConfigurationEndpoints.getBuildConfiguration, {locator: locator});
};

TeamCityAPI.prototype.pauseBuildConfiguration = function (locator) {
  var self = this
    ;

  return self._pauseBuildConfiguration(locator, true);
};

TeamCityAPI.prototype.unpauseBuildConfiguration = function (locator) {
  var self = this
    ;

  return self._pauseBuildConfiguration(locator, false);
};

TeamCityAPI.prototype.isBuildConfigurationPaused = function (locator) {
  var self = this
    , request = self._request
    ;

  return request.execute(buildConfigurationEndpoints.isPaused, {locator: locator});
};

TeamCityAPI.prototype.createBuildConfiguration = function (locator, buildName) {
  var self = this
    , request = self._request
    ;

  if (!buildName) {
    throw new Error("A BuildConfiguration name mut be provided.");
  }

  return request.execute(projectEndpoints.createBuildConfiguration, {locator: locator, name: buildName})
};

TeamCityAPI.prototype.moveProject = function (locator, newParent) {
  var self = this
    , request = self._request
    ;

  return request.execute(projectEndpoints.move, {locator: locator, parent: newParent});
};

TeamCityAPI.prototype.createBuildTemplate = function (locator, templateName) {
  var self = this
    , request = self._request
    ;

  return request.execute(projectEndpoints.createBuildTemplate, {locator: locator, name: templateName});
};

TeamCityAPI.prototype.getBuildTemplates = function (locator) {
  var self = this
    , request = self._request
    ;

  return request.execute(projectEndpoints.getBuildTemplates, {locator: locator || ROOT_PROJECT_LOCATOR});
};

TeamCityAPI.prototype.deleteProject = function (locator) {
  var self = this
    , request = self._request
    ;

  if (!locator) {
    throw new Error("A Project locator must be provided");
  }

  return request.execute(projectEndpoints.delete, {locator: locator})
};

TeamCityAPI.prototype.getAllVcsRoots = function () {
  var self = this
    , request = self._request
    ;

  return request.execute(vcsRootEndpoints.get);
};

TeamCityAPI.prototype.getVcsRoot = function (id) {
  var self = this
    , request = self._request
    ;

  return request.execute(vcsRootEndpoints.getVcsRoot, {locator: id});
};

TeamCityAPI.prototype.createVcsRoot = function (vcsRootDetails, projectId) {
  var self = this
    , request = self._request
    ;

  return request.execute(vcsRootEndpoints.create, {
    projectId: projectId || ROOT_PROJECT_LOCATOR.id,
    vcsRoot: vcsRootDetails
  });
};

TeamCityAPI.prototype.createGitVcsRoot = function (url, projectId) {
  var self = this;
  //TODO need to cater for permuntations
  return self.createGitVcsRoot(vcsRootDetails, projectId);
};

///////////////////////////////////////////////////////////


TeamCityAPI.prototype._getConfig = function () {
  return this._config;
};

TeamCityAPI.prototype._pauseBuildConfiguration = function (locator, pause) {
  var self = this
    , request = self._request
    ;

  return request.execute(buildConfigurationEndpoints.pause, {locator: locator, paused: pause});
};


function loadParametersFromUrl(url, config) {
  var parsed = require("url").parse(url);

  CONFIG_PARAMETERS.forEach(function (param) {
    config[param] = parsed[param];
  });

  if (config.protocol) {
    let matched = /(^http[s]?)/.exec(config.protocol);
    config.protocol = matched[1];
  }
}

function setPort(config) {
  if (!config.port) {
    if (/^https/.test(config.protocol)) {
      config.port = 443;
    } else {
      config.port = 80;
    }
  } else {
    config.port = Number(config.port);
  }
}

function setAuthentication(config, apiConfig) {
  if (config) {
    if (config.user || config.username) {
      if (config.pass || config.password) {
        apiConfig.username = config.user || config.username;
        apiConfig.password = config.password || config.pass;
      }
    }
  }
}