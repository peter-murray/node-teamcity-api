"use strict";

var util = require("util")
  , request = require("./request")
  , hostEndpoints = require("./endpoints/host")//TODO move out
  , ProjectsAPI = require("./api/projects")
  , BuildConfigurationsAPI = require("./api/build-configurations")
  , VcsRootsAPI = require("./api/vcs-roots")
  ;

const CONFIG_PARAMETERS = ["hostname", "port", "protocol"]
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

  if (config.timeout !== undefined) {
    apiConfig.timeout = config.timeout;
  }

  setPort(apiConfig);

  CONFIG_PARAMETERS.forEach(function (param) {
    if (!apiConfig[param]) {
      throw new Error(util.format("Required parameter '%s' was not provided", param));
    }
  });

  this._config = apiConfig;
  this._request = request.create(apiConfig);

  this._initialize();
};
module.exports = TeamCityAPI;


TeamCityAPI.prototype._initialize = function() {
  var self = this
    , request = self._request
    ;

  self.projects = new ProjectsAPI(request);
  self.buildConfigurations = new BuildConfigurationsAPI(request);
  self.vcsRoots = new VcsRootsAPI(request);
  //TODO
};

TeamCityAPI.prototype.getVersion = function () {
  return this._request.execute(hostEndpoints.version);
};

TeamCityAPI.prototype.getApiVersion = function () {
  return this._request.execute(hostEndpoints.apiVersion);
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
      if (config.pass || config.password) {
        apiConfig.username = config.user || config.username;
        apiConfig.password = config.password || config.pass;
      }
    }
  }
}
