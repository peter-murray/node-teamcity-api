"use strict";

var util = require("util")
    , APIEndpoint = require("../api-endpoint")
    , buildTypeLocator = require("../locators/build-type-locator")
    ;



function getBuildConfiguration() {
  return new APIEndpoint()
      .get()
      .uri("buildTypes/{locator}")
      .pureJson()
      .locator({name: "locator", validator: buildTypeLocator});
}

function pauseBuildConfiguration() {
  return new APIEndpoint()
      .put()
      .uri("buildTypes/{locator}/paused")
      .locator({name: "locator", validator: buildTypeLocator})
      .payload(pausePayload)
      .postProcess(function(str) {
        return {paused: JSON.parse(str)};
      });
}

function isPaused() {
  return new APIEndpoint()
      .get()
      .uri("buildTypes/{locator}/paused")
      .locator({name: "locator", validator: buildTypeLocator})
      .postProcess(function(str) {
        return {paused: JSON.parse(str)};
      });
}


module.exports = {
  getBuildConfiguration: getBuildConfiguration(),
  pause: pauseBuildConfiguration(),
  isPaused: isPaused()
};


function pausePayload(data) {
  return {
    body: util.format("%s", data.paused),
    type: "text/plain"
  }
}
