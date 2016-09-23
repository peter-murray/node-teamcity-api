"use strict";

var url = require("url")
  , util = require("util")
  , axios = require("axios")
  ;

var HttpRequest = function (config) {
  var self = this
    , requestConfig = generateRequestConfig(config)
    ;

  self._axios = axios.create(requestConfig);
};

module.exports.create = function (config) {
  return new HttpRequest(config);
};

HttpRequest.prototype.execute = function (api, parameters) {
  var self = this
    , axios = self._axios
    , promise
    ;

  if (!api) {
    throw new Error("An API must be provided");
  }

  promise = axios.request(api.getRequest(parameters))
    .then(function(res) {
      return res.data;
    })
    .catch(function (response) {
      var error;

      if (response instanceof Error) {
        error = response;
      } else {
        error = generateResponseError(response);
      }
      throw error;
    });

  if (api.getErrorHandler()) {
    promise = promise.catch(api.getErrorHandler())
  }

  if (api.getPostProcessing()) {
    promise = promise.then(api.getPostProcessing())
  }

  return promise;
};


function generateRequestConfig(config) {
  var requestConfig = {}
    , baseUrl = url.format(config)
    , urlSuffix
    ;

  if ((config.user || config.username) && (config.pass || config.password)) {
    urlSuffix = "/httpAuth/app/rest";
    requestConfig.auth = {
      username: config.user || config.username,
      password: config.password || config.pass
    }
  } else {
    urlSuffix = "/guestAuth/app/rest";
  }

  requestConfig.baseURL = baseUrl + urlSuffix;
  requestConfig.timeout = config.timeout !== undefined ? config.timeout : 2000;

  return requestConfig;
}

function generateResponseError(response) {
  var err = new Error();

  err.statusCode = response.status;
  err.headers = response.headers;

  if (response.data) {
    err.message = response.data;
  } else {
    err.message = "Unexpected status code: " + response.status;
  }

  return err;
}
