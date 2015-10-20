"use strict";

var deepExtend = require("deep-extend")
    ;

var APIEndpoint = function() {
  this._data = {};
};
module.exports = APIEndpoint;

APIEndpoint.prototype.uri = function(uri) {
  var self = this;
  self._data.uri = uri;
  return self;
};

APIEndpoint.prototype.get = function() {
  var self = this;
  self._data.method = "GET";
  return self;
};

APIEndpoint.prototype.post = function() {
  var self = this;
  self._data.method = "POST";
  return self;
};

APIEndpoint.prototype.acceptJson = function() {
  var self = this;
  self.setHeader("Accept", "application/json");
  return self;
};

APIEndpoint.prototype.pureJson = function() {
  var self = this;
  self._getData().json = true;
  return self;
};

APIEndpoint.prototype.acceptXml = function() {
  var self = this;
  self.setHeader("Accept", "application/xml");
  return self;
};

APIEndpoint.prototype.acceptText = function() {
  var self = this;
  self.setHeader("Accept", "text/plain");
  return self;
};

APIEndpoint.prototype.postProcess = function(fn) {
  var self = this
      , data = self._getData()
      ;

  if (typeof(fn) === "function") {
    data.postProcessing = fn;
  }

  return self;
};

APIEndpoint.prototype.locator = function(locator) {
  var self = this
      , data = self._getData()
      ;

  data._locator = locator;
  return self;
};

APIEndpoint.prototype.urlParameter = function(parameter) {
  var self = this
      , data = self._getData()
      ;

  if (! data._urlParameters) {
    data._urlParameters = [];
  }
  //TODO should validate contract on parameters
  data._urlParameters.push(parameter);

  return self;
};

APIEndpoint.prototype.setHeader = function(name, value) {
  var self = this
      , headers = self._getHeaders()
      ;

  headers[name] = value;
  return self;
};

APIEndpoint.prototype.getPostProcessing = function() {
  var self = this
      , data = self._getData()
      ;
  return data.postProcessing;
};

APIEndpoint.prototype.payload = function(fn) {
  var self = this
      , data = self._getData()
      ;

  data._payloadFn = fn;

  return this;
};

APIEndpoint.prototype.requiresJsonConversion = function() {
  var self = this
      , data = self._getData()
      ;

  return !data.json && data.headers && data.headers["Accept"] === "application/json";
};

APIEndpoint.prototype.getRequest = function(parameters) {
  var self = this
      , data = deepExtend({}, self._getData())
      //, urlParameters = data._urlParameters
      ;

  //if (urlParameters && urlParameters.length > 0) {
  //  //TODO inject the parameters
  //  urlParameters.forEach(function(urlParam) {
  //    var validatorFn = urlParam.validator
  //        , name = urlParam.name
  //        , value
  //        ;
  //
  //    value = validatorFn(parameters[name]);
  //    data.url += value;
  //  })
  //}

  if (data._locator) {
    let name = data._locator.name
        , validatorFn = data._locator.validator
        ;

    data.uri = data.uri.replace("{" + name + "}", validatorFn(parameters[name]).getLocatorValue());

    //data.uri += "/" + validatorFn(parameters[name]).getLocatorValue();
  }

  if (data._payloadFn) {
    let payload = data._payloadFn(parameters)
        , headers = getOrCreateHeaders(data)
        ;

    data.body = payload.body;

    if (payload.type) {
      headers["content-type"] = payload.type;
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

APIEndpoint.prototype.getSuccessCode = function() {
  var self = this;

  return self._getData().statusCode || 200;
};

APIEndpoint.prototype._getHeaders = function() {
  var self  = this
      , data = self._getData()
      ;

  return getOrCreateHeaders(data);
};

APIEndpoint.prototype._getData = function() {
  var self = this;
  return self._data;
};