"use strict";

var expect = require("chai").expect
  , TeamCityAPI = require("../lib/api")
  , testData = require("./config/test-data")
  , nockHelper = require("./nock-helper")
  ;

describe("Build Configuration", function () {

  var teamcity = new TeamCityAPI(testData);

  before(function () {
    nockHelper.record();
  });

  beforeEach(function () {
    nockHelper.beforeEach(this);
  });

  afterEach(function () {
    nockHelper.afterEach(this);
  });

  after(function () {
    nockHelper.reset();
  });

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

  describe("#pauseBuildConfiguration()", function () {

    it("should pause a BuildConfiguration", function (done) {
      teamcity.pauseBuildConfiguration({id: "Tests_BuildConfigurationToPause"})
        .then(function (result) {
          expect(result).to.have.property("paused", true);
          done();
        })
        .done();
    });
  });

  describe("#unpauseBuildConfiguration()", function () {

    it("should unpause a BuildConfiguration", function (done) {
      teamcity.unpauseBuildConfiguration({id: "Tests_BuildConfigurationToPause"})
        .then(function (result) {
          expect(result).to.have.property("paused", false);
          done();
        })
        .done();
    });
  });

  describe("#isBuildConfigurationPaused()", function () {

    it("should report back the paused status", function (done) {
      teamcity.isBuildConfigurationPaused({id: "Tests_PausedBuildConfiguration"})
        .then(function (result) {
          expect(result).to.have.property("paused", true);
          done();
        })
        .done();
    });

    it("should report that the BuildConfiguration is not paused", function (done) {
      teamcity.isBuildConfigurationPaused({id: "Tests_UnpausedBuildConfiguration"})
        .then(function (result) {
          expect(result).to.have.property("paused", false);
          done();
        })
        .done();
    });
  });

  describe("#getBuildConfigurationVcsRoots()", function () {

    it("should obtain all VCS Roots", function (done) {
      teamcity.getBuildConfigurationVcsRoots({id: "Test_Deploy"})
        .then(function (vcsRoots) {
          expect(vcsRoots).to.have.property("OrgTest");
          done();
        })
        .done();
    })
  });

  describe("#attachVcsRoot()", function () {

    var projectId
      , buildLocator
      ;

    beforeEach(function (done) {
      teamcity.createProject("test", "_Root")
        .then(function (project) {
          projectId = project.id;
          return teamcity.createBuildConfiguration({id: project.id}, "addVcsRootTest")
        })
        .then(function (created) {
          buildLocator = {id: created.id};
          done();
        })
        .done();
    });

    afterEach(function (done) {
      if (buildLocator) {
        teamcity.deleteProject({id: projectId})
          .then(function () {
            done();
          })
          .done();
      } else {
        done();
      }
    });

    it("should add a new VCS Root", function (done) {
      teamcity.attachVcsRoot(buildLocator, "OrgTest")
        .then(function (result) {
          expect(result).to.be.true;
          done();
        })
        .done();
    });

    it("should work when adding an existing VCS Root", function (done) {
      teamcity.attachVcsRoot(buildLocator, "OrgTest")
        .then(function (result) {
          expect(result).to.be.true;
          return teamcity.attachVcsRoot(buildLocator, "OrgTest");
        })
        .then(function (result) {
          expect(result).to.be.true;
          done();
        })
        .done();
    });
  });

  describe("#deleteVcsRoot()", function () {

    var projectId
      , buildLocator
      ;

    beforeEach(function (done) {
      teamcity.createProject("test", "_Root")
        .then(function (project) {
          projectId = project.id;
          return teamcity.createBuildConfiguration({id: project.id}, "deleteVcsRootTest")
        })
        .then(function (created) {
          buildLocator = {id: created.id};
          return teamcity.attachVcsRoot(buildLocator, "OrgTest");
        })
        .then(function (result) {
          expect(result).to.be.true;
          done();
        })
        .done();
    });

    afterEach(function (done) {
      if (projectId) {
        teamcity.deleteProject({id: projectId})
          .then(function () {
            done();
          })
          .done();
      } else {
        done();
      }
    });

    it("should remove an existing VCS Root", function (done) {
      teamcity.detachVcsRoot(buildLocator, "OrgTest")
        .then(function (result) {
          expect(result).to.be.true;
          done();
        })
        .done();
    });

    it("should fail to remove a non-existing VCS Root", function (done) {
      teamcity.detachVcsRoot(buildLocator, "nonExistentRoot")
        .then(function () {
            throw new Error("should never get here");
          }
          , function (err) {
            expect(err.message).to.contain("VCS Root is not attached");
            done();
          })
        .done();
    });
  });

  describe("#deleteBuildConfiguration()", function () {

    var projectId
      , buildLocator
      ;

    beforeEach(function (done) {
      teamcity.createProject("test", "_Root")
        .then(function (project) {
          projectId = project.id;
          return teamcity.createBuildConfiguration({id: project.id}, "deleteBuildConfiguration")
        })
        .then(function (result) {
          buildLocator = {id: result.id};
          done();
        })
        .done();
    });

    afterEach(function (done) {
      if (projectId) {
        teamcity.deleteProject({id: projectId})
          .then(function () {
            done();
          })
          .done();
      } else {
        done();
      }
    });

    it("should delete an existing Build Configuration", function (done) {
      teamcity.deleteBuildConfiguration(buildLocator)
        .then(function (result) {
          expect(result).to.be.true;
          done();
        })
        .done();
    });

    it("should fail to delete a non-existing Build Configuration", function (done) {
      teamcity.deleteBuildConfiguration({id: "TestConfigThatDoesNotExist"})
        .then(function () {
            throw new Error("Should not get here");
          },
          function (err) {
            expect(err.message).to.contain("404");
            done();
          })
        .done();
    });
  });

});