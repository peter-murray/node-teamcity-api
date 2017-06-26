"use strict";

var expect = require("chai").expect
    , TeamCityAPI = require("../lib/api")
    , testData = require("./config/test-data")
    , nockHelper = require("./nock-helper")
;

describe("#buildConfigurations features", function () {

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


  describe("features", function () {

    var featureData = {
          "id": "jetbrains.agent.free.space",
          "type": "jetbrains.agent.free.space",
          "properties": {
            "count": 1,
            "property": [{
              "name": "free-space-work",
              "value": "3gb"
            }]
          }
        }
        , featuresData = {
          "count": 2,
          "feature": [
            featureData,
            {
              "id": "perfmon",
              "type": "perfmon"
            }
          ]
        }
        , emptyFeaturesData = {
          "count": 0
        }
        , projectId
        , buildLocator
    ;

    // Create an empty configuration in a test project
    beforeEach(function () {
      // var projectTitle = "features test - " + this.currentTest.fullTitle().replace(/[#\(\):'"<> ]/g, '');

      // return teamcity.projects.create(projectTitle, "_Root")
      return teamcity.projects.create("BuildConfigurationFeatures", "_Root")
          .then(function (project) {
            projectId = project.id;
            return teamcity.projects.createBuildConfiguration({id: project.id}, "featuresTest")
          })
          .then(function (created) {
            buildLocator = {id: created.id};
          });
    });

    afterEach(function () {
      if (projectId) {
        return teamcity.projects.delete({id: projectId});
      }
    });


    describe("#getFeatures()", function () {

      it("on a Build Configuration with no features", function () {
        return teamcity.buildConfigurations.getFeatures(buildLocator)
            .then(function (result) {
              expect(result).to.exist;
              expect(result).to.deep.equal(emptyFeaturesData);
            });
      });

      it("on a Build Configuration with features", function () {
        return teamcity.buildConfigurations.setFeatures(buildLocator, featuresData)
            .then(function () {
              return teamcity.buildConfigurations.getFeatures(buildLocator);
            })
            .then(function (result) {
              expect(result).to.exist;
              expect(result).to.deep.equal(featuresData);
            });
      });
    });


    describe("#setFeatures()", function () {

      it("should set the complete set of features for a build configuration", function () {
        return teamcity.buildConfigurations.setFeatures(buildLocator, featuresData)
            .then(function (result) {
              expect(result).to.exist;
              expect(result).to.deep.equal(featuresData);
            });
      });
    });


    describe("#addFeature()", function () {

      beforeEach(function () {
        return teamcity.buildConfigurations.setFeatures(buildLocator, emptyFeaturesData);
      });

      it("should add features by build configuration id", function () {
        return teamcity.buildConfigurations.addFeature(buildLocator, featureData)
            .then(function (feature) {
              expect(feature).to.exist;
              expect(feature).to.deep.equal(featureData);
            });
      });
    });


    describe("#deleteFeature()", function () {

      beforeEach(function () {
        return teamcity.buildConfigurations.addFeature(buildLocator, featureData)
            .then(function (result) {
              expect(result).to.exist;
              expect(result).to.have.property("id", featureData.id);
            });
      });

      it("should remove an existing Feature", function () {
        return teamcity.buildConfigurations.deleteFeature(buildLocator, featureData.id)
            .then(function (result) {
              expect(result).to.be.true;
              return teamcity.buildConfigurations.getFeatures(buildLocator);
            })
            .then(function (result) {
              expect(result).to.deep.equal(emptyFeaturesData);
            });
      });

      it("should fail to remove a non-existing Feature", function () {
        return teamcity.buildConfigurations.deleteFeature(buildLocator, "nonExistentFeature")
            .then(function () {
                  throw new Error("should never get here");
                }
                , function (err) {
                  expect(err.message).to.contain("No feature with id 'nonExistentFeature' is found in the build configuration.");
                });
      });
    });
  });
});
