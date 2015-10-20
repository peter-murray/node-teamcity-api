"use strict";

var APIEndpoint = require("../api-endpoint")
    ;

function version() {
  return new APIEndpoint().get().uri("version").acceptText();
}

function apiVersion() {
  return new APIEndpoint().get().uri("apiVersion").acceptText();
}

module.exports = {
  version: version(),
  apiVersion: apiVersion()
};