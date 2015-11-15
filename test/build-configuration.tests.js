"use strict";

var expect = require("chai").expect
    , TeamCityAPI = require("../lib/api")
    , testData = require("./config/test-data")
    ;

describe("Build Configuration", function() {

  var teamcity = new TeamCityAPI(testData);

  describe("#getBuildConfiguration()", function () {

    it("should obtain the BuildConfiguration by id", function (done) {
      teamcity.getBuildConfiguration({id: "Tests_BuildConfigurationTest"})
          .then(function (buildConfig) {
            expect(buildConfig).to.exist;

            expect(buildConfig).to.have.property("id", "Tests_BuildConfigurationTest");
            expect(buildConfig).to.have.property("name", "BuildConfigurationTest");

            expect(buildConfig).to.have.property("projectId", "Tests");
            expect(buildConfig).to.have.property("project");

            expect(buildConfig).to.have.property("vcs-root-entries");
            expect(buildConfig).to.have.property("settings");
            expect(buildConfig).to.have.property("parameters");
            expect(buildConfig).to.have.property("parameters");

            done();
          })
          .done();
    });

    //TODO need more tests using different variations of locator
  });

  describe("#pauseBuildConfiguration()", function() {

    it("should pause a BuildConfiguration", function(done) {
      teamcity.pauseBuildConfiguration({id: "Tests_BuildConfigurationToPause"})
          .then(function(result) {
            expect(result).to.have.property("paused", true);
            done();
          })
          .done();
    });
  });

  describe("#unpauseBuildConfiguration()", function() {

    it("should unpause a BuildConfiguration", function(done) {
      teamcity.unpauseBuildConfiguration({id: "Tests_BuildConfigurationToPause"})
          .then(function(result) {
            expect(result).to.have.property("paused", false);
            done();
          })
          .done();
    });
  });

  describe("#isBuildConfigurationPaused()", function() {

    it("should report back the paused status", function(done) {
      teamcity.isBuildConfigurationPaused({id: "Tests_PausedBuildConfiguration"})
          .then(function(result) {
            expect(result).to.have.property("paused", true);
            done();
          })
          .done();
    });

    it("should report that the BuildConfiguration is not paused", function(done) {
      teamcity.isBuildConfigurationPaused({id: "Tests_UnpausedBuildConfiguration"})
          .then(function(result) {
            expect(result).to.have.property("paused", false);
            done();
          })
          .done();
    });
  });

});