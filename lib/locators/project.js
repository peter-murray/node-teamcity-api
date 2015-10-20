"use strict";

var util = require("util")
    , url = require("url")
    ;

var ProjectLocator = function() {
  this._data = {};
};

ProjectLocator.prototype.id = function(id) {
  var self = this
      , data = self._data
      ;
  data.id = id;
};

ProjectLocator.prototype.name = function(name) {
  var self = this
      , data = self._data
      ;
  data.name = name;
};

ProjectLocator.prototype.getLocatorValue = function() {
  var self = this
      , data = self._data
      , result
      ;

  if (data.id) {
    result = util.format("id:%s", data.id);
  } else if (data.name) {
    result = util.format("name:%s", encodeURIComponent(data.name));
  } else {
    throw new Error("The ProjectLocator did not have an 'id' or 'name'");
  }

  return result;
};

module.exports = function(data) {
  var result = new ProjectLocator();

  if (data.id) {
    result.id(data.id);
  } else if (data.name) {
    result.name(data.name);
  } else {
    result.id(data);
  }

  return result;
};
