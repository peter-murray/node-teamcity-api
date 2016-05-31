"use strict";

var expect = require("chai").expect
  , TeamCityAPI = require("../lib/api")
  , testData = require("./config/test-data")
  , nockHelper = require("./nock-helper")
  ;

describe("#buildConfigurations", function () {

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

  describe("#get()", function () {

    it("should obtain the BuildConfiguration by id", function () {
      return teamcity.buildConfigurations.get({id: "Tests_BuildConfigurationTest"})
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
        });
    });

    //TODO need more tests using different variations of locator
  });

  describe("#pause()", function () {

    it("should pause a BuildConfiguration", function () {
      return teamcity.buildConfigurations.pause({id: "Tests_BuildConfigurationToPause"})
        .then(function (result) {
          expect(result).to.have.property("paused", true);
        });
    });
  });

  describe("#unpause()", function () {

    it("should unpause a BuildConfiguration", function () {
      return teamcity.buildConfigurations.unpause({id: "Tests_BuildConfigurationToPause"})
        .then(function (result) {
          expect(result).to.have.property("paused", false);
        });
    });
  });

  describe("#isPaused()", function () {

    it("should report back the paused status", function () {
      return teamcity.buildConfigurations.isPaused({id: "Tests_PausedBuildConfiguration"})
        .then(function (result) {
          expect(result).to.have.property("paused", true);
        });
    });

    it("should report that the BuildConfiguration is not paused", function () {
      return teamcity.buildConfigurations.isPaused({id: "Tests_UnpausedBuildConfiguration"})
        .then(function (result) {
          expect(result).to.have.property("paused", false);
        });
    });
  });

  describe("#getVcsRoots()", function () {

    it("should obtain all VCS Roots", function () {
      return teamcity.buildConfigurations.getVcsRoots({id: "Tests_Deploy"})
        .then(function (vcsRoots) {
          expect(vcsRoots).to.have.property("OrgTest");
        });
    })
  });

  describe("#attachVcsRoot()", function () {

    var projectId
      , buildLocator
      ;

    beforeEach(function () {
      return teamcity.projects.create("test", "_Root")
        .then(function (project) {
          projectId = project.id;
          return teamcity.projects.createBuildConfiguration({id: project.id}, "addVcsRootTest")
        })
        .then(function (created) {
          buildLocator = {id: created.id};
        });
    });

    afterEach(function (done) {
      if (buildLocator) {
        teamcity.projects.delete({id: projectId})
          .then(function () {
            done();
          });
      } else {
        done();
      }
    });

    it("should add a new VCS Root", function () {
      return teamcity.buildConfigurations.attachVcsRoot(buildLocator, "OrgTest")
        .then(function (result) {
          expect(result).to.be.true;
        });
    });

    it("should work when adding an existing VCS Root", function () {
      return teamcity.buildConfigurations.attachVcsRoot(buildLocator, "OrgTest")
        .then(function (result) {
          expect(result).to.be.true;
          return teamcity.buildConfigurations.attachVcsRoot(buildLocator, "OrgTest");
        })
        .then(function (result) {
          expect(result).to.be.true;
        });
    });
  });

  describe("#deleteVcsRoot()", function () {

    var projectId
      , buildLocator
      ;

    beforeEach(function () {
      return teamcity.projects.create("test", "_Root")
        .then(function (project) {
          projectId = project.id;
          return teamcity.projects.createBuildConfiguration({id: project.id}, "deleteVcsRootTest")
        })
        .then(function (created) {
          buildLocator = {id: created.id};
          return teamcity.buildConfigurations.attachVcsRoot(buildLocator, "OrgTest");
        })
        .then(function (result) {
          expect(result).to.be.true;
        });
    });

    afterEach(function (done) {
      if (projectId) {
        teamcity.projects.delete({id: projectId})
          .then(function () {
            done();
          })
      } else {
        done();
      }
    });

    it("should remove an existing VCS Root", function () {
      return teamcity.buildConfigurations.detachVcsRoot(buildLocator, "OrgTest")
        .then(function (result) {
          expect(result).to.be.true;
        });
    });

    it("should fail to remove a non-existing VCS Root", function () {
      return teamcity.buildConfigurations.detachVcsRoot(buildLocator, "nonExistentRoot")
        .then(function () {
            throw new Error("should never get here");
          }
          , function (err) {
            expect(err.message).to.contain("No VCS root found by internal or external id");
          });
    });
  });

  describe("#delete()", function () {

    var projectId
      , buildLocator
      ;

    beforeEach(function () {
      return teamcity.projects.create("test", "_Root")
        .then(function (project) {
          projectId = project.id;
          return teamcity.projects.createBuildConfiguration({id: project.id}, "deleteBuildConfiguration")
        })
        .then(function (result) {
          buildLocator = {id: result.id};
        });
    });

    afterEach(function (done) {
      if (projectId) {
        teamcity.projects.delete({id: projectId})
          .then(function () {
            done();
          });
      } else {
        done();
      }
    });

    it("should delete an existing Build Configuration", function () {
      return teamcity.buildConfigurations.delete(buildLocator)
        .then(function (result) {
          expect(result).to.be.true;
        });
    });

    it("should fail to delete a non-existing Build Configuration", function () {
      return teamcity.buildConfigurations.delete({id: "TestConfigThatDoesNotExist"})
        .then(function () {
            throw new Error("Should not get here");
          },
          function (err) {
            expect(err.message).to.contain("No build type nor template is found by id");
          });
    });
  });


  describe("#attachTemplate()", function () {

    var buildLocator
      ;

    beforeEach(function () {
      return teamcity.projects.createBuildConfiguration({id: "BuildTemplateTests"}, "BuildForAttachment")
        .then(function (build) {
          buildLocator = {id: build.id};
        })
    });

    afterEach(function () {
      return teamcity.buildConfigurations.delete(buildLocator);
    });

    it("should attach a build template", function () {
      var templateLocator = {id: "BuildTemplateTests_BuildTemplate1448370750225"};

      return teamcity.buildConfigurations.attachTemplate(buildLocator, templateLocator)
        .then(function (result) {
          expect(result).to.have.property("id", templateLocator.id);
        });
    })
  });


  describe("#getAttachedTemplate()", function () {

    it("should get the attached build template", function () {
      var buildLocator = {id: "BuildTemplateTests_BuildWithTemplate"};

      return teamcity.buildConfigurations.getAttachedTemplate(buildLocator)
        .then(function (result) {
          console.log(JSON.stringify(result, null, 2));
          expect(result).to.have.property("id", "BuildTemplateTests_BuildTemplate1448370750225");
        });
    });

    it("should not return a template for build without one", function () {
      return teamcity.buildConfigurations.getAttachedTemplate({id: "BuildTemplateTests_BuildWithoutTemplate"})
        .then(function (result) {
          expect(result).to.be.null;
        });
    });

    it("should error on a non-existent template", function () {
      return teamcity.buildConfigurations.getAttachedTemplate({id: "nonExistentBuild"})
        .then(function () {
            throw new Error("Should not get here");
          },
          function (err) {
            expect(err).to.be.instanceof(Error);
          });
    });
  });


  describe("#detachTemplate()", function() {

    var buildLocator;

    beforeEach(function() {
      return teamcity.projects.createBuildConfiguration({id: "BuildTemplateTests"}, "TemplateTestDetach")
        .then(function(result) {
          buildLocator = {id: result.id};
          return teamcity.buildConfigurations.attachTemplate(buildLocator, {id: "BuildTemplateTests_BuildTemplate1448370750225"});
        });
    });

    afterEach(function() {
      teamcity.buildConfigurations.delete(buildLocator);
    });

    it("should detach a template", function() {
      return teamcity.buildConfigurations.detachTemplate(buildLocator)
        .then(function(result) {
          expect(result).to.be.true;
        });
    });

    it("should not detach a template when one not attached", function() {
      return teamcity.buildConfigurations.detachTemplate({id: "BuildTemplateTests_BuildWithoutTemplate"})
        .then(function(result) {
          expect(result).to.be.true;
        });
    });

    it("should fail for non existent build", function() {
      return teamcity.buildConfigurations.detachTemplate({id: "nonExistentBuild"})
        .then(function () {
            throw new Error("Should not get here");
          },
          function (err) {
            expect(err).to.be.instanceof(Error);
          });
    });
  });

});