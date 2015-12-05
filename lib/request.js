"use strict";

var url = require("url")
  , util = require("util")
  , request = require("request")
  , Q = require("q")
  ;

var HttpRequest = function (config) {
  var self = this
    , requestConfig = generateRequestConfig(config)
    ;

  self._request = request.defaults(requestConfig);
};

module.exports.create = function (config) {
  return new HttpRequest(config);
};

HttpRequest.prototype.execute = function (api, parameters) {
  var self = this
    , request = self._request
    , deferred = Q.defer()
    ;

  if (!api) {
    throw new Error("An API must be provided");
  }

  request(api.getRequest(parameters), function (err, res) {
    if (err) {
      deferred.reject(err);
    } else {
      if (res.statusCode === api.getSuccessCode()) {

        if (api.requiresJsonConversion()) {
          deferred.resolve(JSON.parse(res.body));
        } else {
          deferred.resolve(res.body);
        }
      } else {
        deferred.reject(new Error(util.format("Unexpected Status Code, %s, expected, %s", res.statusCode, api.getSuccessCode())))
      }
    }
  });

  if (api.getPostProcessing()) {
    return deferred.promise.then(api.getPostProcessing())
  } else {
    return deferred.promise;
  }
};


function generateRequestConfig(config) {
  var requestConfig = {}
    , baseUrl = url.format(config)
    , urlSuffix
    ;

  if ((config.user || config.username) && (config.pass || config.password)) {
    urlSuffix = "/httpAuth/app/rest";
    requestConfig.auth = {
      user: config.user || config.username,
      pass: config.password || config.pass,
      sendImmediately: true
    }
  } else {
    urlSuffix = "/guestAuth/app/rest";
  }

  requestConfig.baseUrl = baseUrl + urlSuffix;

  return requestConfig;
}
