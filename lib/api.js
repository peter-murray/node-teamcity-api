"use strict";

var util = require("util")
    , request = require("./request")
    , hostEndpoints = require("./endpoints/host")
    , projectEndpoints = require("./endpoints/projects")
    ;

const CONFIG_PARAMETERS = ["hostname", "port", "protocol"];

var TeamCityAPI = function (config) {
  var apiConfig = {}
      ;

  if (! config) {
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

  CONFIG_PARAMETERS.forEach(function(param) {
    if (!apiConfig[param]) {
      throw new Error(util.format("Required parameter '%s' was not provided", param));
    }
  });

  this._config = apiConfig;
  this._request = request.create(apiConfig);
};
module.exports = TeamCityAPI;


TeamCityAPI.prototype.getVersion = function() {
  var self = this
      , request = self._request
      ;

  return request.execute(hostEndpoints.version);
};

TeamCityAPI.prototype.getApiVersion = function() {
  var self = this
      , request = self._request
      ;

  return request.execute(hostEndpoints.apiVersion);
};

TeamCityAPI.prototype.getProjects = function() {
  var self = this
      , request = self._request
      ;

  return request.execute(projectEndpoints.projects);
};

TeamCityAPI.prototype.getProject = function(locator) {
  var self = this
      , request = self._request
      ;

  return request.execute(projectEndpoints.project, {locator: locator});
};

TeamCityAPI.prototype.createProject = function(name, parentId) {
  var self = this
      , request = self._request
      ;

  return request.execute(projectEndpoints.createProject, {name: name, parentId: parentId})
};

TeamCityAPI.prototype.setProjectParameter = function(locator, name, value) {
  var self = this
      , request = self._request
      ;

  return request.execute(projectEndpoints.setParameter, {locator: locator, name: name, value: value});
};

TeamCityAPI.prototype.getProjectParameters = function(locator) {
  var self = this
      , request = self._request
      ;

  return request.execute(projectEndpoints.getParameters, {locator: locator});
};


///////////////////////////////////////////////////////////


TeamCityAPI.prototype._getConfig = function () {
  return this._config;
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
      if(config.pass || config.password) {
        apiConfig.username = config.user || config.username;
        apiConfig.password = config.password || config.pass;
      }
    }
  }
}