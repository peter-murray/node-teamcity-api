"use strict";

var TeamCityAPI = require("./lib/api.js");

module.exports.create = function(config) {
    return new TeamCityAPI(config);
};