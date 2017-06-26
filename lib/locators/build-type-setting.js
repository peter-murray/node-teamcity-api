"use strict";

var util = require("util")
;

var BuildTypeSettingLocator = function () {
  this._data = {};
};

BuildTypeSettingLocator.prototype.id = function (id) {
  var self = this
      , data = self._data
  ;
  data.id = id;
};

BuildTypeSettingLocator.prototype.getLocatorValue = function () {
  var self = this
      , data = self._data
      , result
  ;

  if (data.id) {
    result = util.format("%s", data.id);
  } else {
    throw new Error("The BuildTypeSettingLocator did not have an 'id'");
  }

  return result;
};

BuildTypeSettingLocator.prototype.getLocatorId = function () {
  var self = this
      , data = self._data
      , result
  ;

  if (data.id) {
    result = data.id;
  } else {
    throw new Error("The BuildTypeSettingLocator did not have an 'id'");
  }

  return result;
};

module.exports = function (data) {
  var result = new BuildTypeSettingLocator();

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
