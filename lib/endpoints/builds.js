"use strict";

var util = require("util")
  , APIEndpoint = require("../api-endpoint")
  , buildTypeLocator = require("../locators/build-type-locator")
  , vcsRootLocator = require("../locators/vcs-root")
  ;

function getBuildsWithCount() {
  return new APIEndpoint()
    .get()
    .uri("builds/?locator=buildType:({locator},{count})")
    .pureJson()
    .locator({name: "locator", validator: buildTypeLocator})
    .locator({name: "count", validator: buildTypeLocator})
    ;
}
function getBuildById() {
  return new APIEndpoint()
    .get()
    .uri("builds/{locator}")
    .pureJson()
    .locator({name: "locator", validator: buildTypeLocator});
}

module.exports = {
    getBuildsWithCount: getBuildsWithCount(),
    getBuildById: getBuildById()
}