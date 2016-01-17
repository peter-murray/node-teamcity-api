"use strict";

var util = require("util")
  , deepExtend = require("deep-extend")
  , APIEndpoint = require("../api-endpoint")
  , vcsRootLocator = require("../locators/vcs-root")
  ;

function getVcsRoots() {
  return new APIEndpoint()
    .get()
    .uri("vcs-roots")
    .pureJson()
    .postProcess(convertVcsRoots)
    ;
}

function getVcsRoot() {
  return new APIEndpoint()
    .get()
    .uri("vcs-roots/{locator}")
    .pureJson()
    .locator({name: "locator", validator: vcsRootLocator})
    .postProcess(convertVcsRoot)
    ;
}

function createVcsRoot() {
  return new APIEndpoint()
    .post()
    .uri("vcs-roots")
    .pureJson()
    .payload(vcsRootPayload)
    .postProcess(convertVcsRoot)
    ;
}

function deleteVcsRoot() {
  return new APIEndpoint()
    .delete()
    .uri("vcs-roots/{locator}")
    .locator({name: "locator", validator: vcsRootLocator})
    .pureJson()
    .statusCode(204)
    .postProcess(function() {return true;})
    ;
}

module.exports = {
  get: getVcsRoots(),
  getVcsRoot: getVcsRoot(),
  create: createVcsRoot(),
  deleteVcsRoot: deleteVcsRoot()
};

function convertVcsRoots(data) {
  var result = {};

  if (data && data["vcs-root"]) {
    data["vcs-root"].forEach(function (vcsRoot) {
      result[vcsRoot.id] = vcsRoot;
    });
  }

  return result;
}

function convertVcsRoot(root) {
  var result = deepExtend({}, root)
    , properties = {}
    ;

  if (root && root.properties) {
    root.properties.property.forEach(function (property) {
      properties[property.name] = property.value;
    });
  }

  result.properties = properties;
  return result;
}

function vcsRootPayload(data) {
  var project = data.projectId
    , vcsRootDetails = deepExtend({project: {id: project}}, data.vcsRoot)
    ;

  //TODO a lot of validation/formatting is required here
  return {
    body: vcsRootDetails,
    type: "application/json"
  }
}