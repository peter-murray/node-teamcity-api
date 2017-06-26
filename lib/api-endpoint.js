"use strict";

var deepExtend = require("deep-extend")
;

var debug = /teamcity\-api/.test(process.env["NODE_DEBUG"]);

var APIEndpoint = function () {
  this._data = {};
};
module.exports = APIEndpoint;

APIEndpoint.prototype.uri = function (uri) {
  var self = this;
  self._data.url = uri;
  return self;
};

APIEndpoint.prototype.get = function () {
  var self = this;
  self._data.method = "GET";
  return self;
};

APIEndpoint.prototype.post = function () {
  var self = this;
  self._data.method = "POST";
  return self;
};

APIEndpoint.prototype.put = function () {
  var self = this;
  self._data.method = "PUT";
  return self;
};

APIEndpoint.prototype.delete = function () {
  var self = this;
  self._data.method = "DELETE";
  return self;
};

APIEndpoint.prototype.acceptJson = function () {
  var self = this;
  self.setHeader("Accept", "application/json");
  return self;
};

APIEndpoint.prototype.pureJson = function () {
  var self = this;
  self._getData().json = true;
  return self;
};

APIEndpoint.prototype.acceptXml = function () {
  var self = this;
  self.setHeader("Accept", "application/xml");
  return self;
};

APIEndpoint.prototype.acceptText = function () {
  var self = this;
  self.setHeader("Accept", "text/plain");
  return self;
};

APIEndpoint.prototype.postProcess = function (fn) {
  var self = this
      , data = self._getData()
  ;

  if (typeof(fn) === "function") {
    data.postProcessing = fn;
  }

  return self;
};

APIEndpoint.prototype.errorHandler = function (fn) {
  var self = this
      , data = self._getData()
  ;

  if (typeof(fn) === "function") {
    data.errorHandler = fn;
  }

  return self;
};

APIEndpoint.prototype.locator = function (locator) {
  var self = this
      , data = self._getData()
  ;

  if (!data._locator) {
    data._locator = []
  }

  data._locator.push(locator);
  return self;
};

APIEndpoint.prototype.statusCode = function (expectedStatusCode) {
  var self = this
      , data = self._getData()
  ;

  data.statusCode = expectedStatusCode;
  return self;
};

APIEndpoint.prototype.setHeader = function (name, value) {
  var self = this
      , headers = self._getHeaders()
  ;

  headers[name] = value;
  return self;
};

APIEndpoint.prototype.getPostProcessing = function () {
  var self = this
      , data = self._getData()
  ;
  return data.postProcessing;
};

APIEndpoint.prototype.getErrorHandler = function () {
  var self = this
      , data = self._getData()
  ;

  return data.errorHandler;
};

APIEndpoint.prototype.payload = function (fn) {
  var self = this
      , data = self._getData()
  ;

  data._payloadFn = fn;

  return this;
};

APIEndpoint.prototype.requiresJsonConversion = function () {
  var self = this
      , data = self._getData()
  ;

  return data.json || (data.headers && data.headers["Accept"] === "application/json");
};

APIEndpoint.prototype.getRequest = function (parameters) {
  var self = this
      , data = deepExtend({}, self._getData())
  ;

  if (data._locator) {
    data._locator.forEach(function (locator) {
      var name = locator.name
          , validatorFn = locator.validator
      ;

      data.url = data.url.replace("{" + name + "}", validatorFn(parameters[name]).getLocatorValue());
    });
  }

  if (data._payloadFn) {
    let payload = data._payloadFn(parameters)
        , headers = getOrCreateHeaders(data)
    ;

    data.data = payload.body;

    if (payload.type) {
      headers["Content-Type"] = payload.type;
    }
  }

  if (debug) {
    console.log(JSON.stringify(data));//TODO redact auth passwords
  }

  if (data.statusCode) {
    data.validateStatus = function (status) {
      return status === data.statusCode;
    }
  }

  // Stop axios parsing text data as JSON
  if (!self.requiresJsonConversion()) {
    data.transformResponse = function (data) {
      return data;
    }
  }

  return data;
};

function getOrCreateHeaders(data) {
  if (data) {
    if (!data.headers) {
      data.headers = {};
    }

    return data.headers;
  }
}

APIEndpoint.prototype.getSuccessCode = function () {
  var self = this;

  return self._getData().statusCode || 200;
};

APIEndpoint.prototype._getHeaders = function () {
  var self = this
      , data = self._getData()
  ;

  return getOrCreateHeaders(data);
};

APIEndpoint.prototype._getData = function () {
  var self = this;
  return self._data;
};