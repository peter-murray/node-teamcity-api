"use strict";

var util = require("util")
;

var ProjectLocator = function () {
  this._data = {};
};

ProjectLocator.prototype.id = function (id) {
  var self = this
      , data = self._data
  ;
  data.id = id;
};

ProjectLocator.prototype.name = function (name) {
  var self = this
      , data = self._data
  ;
  data.name = name;
};

ProjectLocator.prototype.project = function (project) {
  var self = this
      , data = self._data
  ;
  data.project = project;
}

ProjectLocator.prototype.getLocatorValue = function () {
  var self = this
      , data = self._data
      , result
  ;

  if (data.id) {
    result = util.format("id:%s", data.id);
  } else if (data.name) {
    result = util.format("name:%s", encodeURIComponent(data.name));
  } else if (data.project) {
    result = util.format("project:%s", encodeURIComponent(data.project));
  } else {
    throw new Error("The ProjectLocator did not have an 'id' or 'name' or 'project'");
  }

  return result;
};

module.exports = function (data) {
  var result = new ProjectLocator();

  if (data.id) {
    result.id(getValue(data.id));
  } else if (data.name) {
    result.name(getValue(data.name));
  } else if (data.project) {
    result.project(getValue(data.project));
  } else {
    result.id(getValue(data));
  }

  return result;
};

function getValue(value) {
  if (!value) {
    throw new Error("A value was not provided for the Locator to be created")
  }
  return value;
}