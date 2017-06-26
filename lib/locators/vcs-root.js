"use strict";

var util = require("util")
;

var VcsRootLocator = function () {
  this._data = {};
};

VcsRootLocator.prototype.id = function (id) {
  var self = this
      , data = self._data
  ;
  data.id = id;
};

VcsRootLocator.prototype.getLocatorValue = function () {
  var self = this
      , data = self._data
      , result
  ;

  if (data.id) {
    result = util.format("id:%s", data.id);
  } else {
    throw new Error("The VcsRootLocator did not have an 'id'");
  }

  return result;
};

VcsRootLocator.prototype.getLocatorId = function () {
  var self = this
      , data = self._data
      , result
  ;

  if (data.id) {
    result = data.id;
  } else {
    throw new Error("The VcsRootLocator did not have an 'id'");
  }

  return result;
};

module.exports = function (data) {
  var result = new VcsRootLocator();

  if (data) {
    if (data.id) {
      result.id(getValue(data.id));
    } else {
      result.id(getValue(data));
    }
  }

  return result;
};

function getValue(value) {
  if (!value) {
    throw new Error("A value was not provided for the Locator to be created")
  }
  return value;
}