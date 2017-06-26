"use strict";

var expect = require("chai").expect
    , TeamCityAPI = require("../lib/api")
    , testData = require("./config/test-data")
    , nockHelper = require("./nock-helper")
;

describe("#buildConfigurations triggers", function () {

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


  describe("#getTriggers()", function () {
    
    it("should obtain the triggers by build configuration id", function () {
      return teamcity.buildConfigurations.getTriggers({id: "BuildConfigurations_NoTriggers"})
          .then(function (triggers) {
            expect(triggers).to.exist;

            expect(triggers).to.have.property("count", 0);
          });
    });
  });


  describe("#setTriggers()", function () {

    it("should set triggers by build configuration id", function () {
      var triggerData = {
        "count": 8,
        "trigger": [{
          "id": "TEST_TRIGGER_12345",
          "type": "buildDependencyTrigger",
          "properties": {
            "count": 2,
            "property": [{
              "name": "afterSuccessfulBuildOnly",
              "value": "true"
            }, {
              "name": "dependsOn",
              "value": "Tests_BuildConfigurationTest"
            }]
          }
        }]
      };

      return teamcity.buildConfigurations.setTriggers({id: "BuildConfigurations_WithTriggers"}, triggerData)
          .then(function (triggers) {
            expect(triggers).to.exist;

            expect(triggers).to.have.property("count", 1);
            expect(triggers["trigger"]).to.be.instanceof(Array);
            expect(triggers["trigger"][0]).to.have.property("type", "buildDependencyTrigger");
          });
    });
  });


  describe("#isTriggerDisabled()", function () {

    it("with disabled trigger", function () {
      return teamcity.buildConfigurations.isTriggerDisabled({id: "BuildConfigurations_DisabledTrigger"}, "vcsTrigger")
          .then(function (result) {
            expect(result).to.have.property("disabled", true);
          });
    });

    it("with enabled trigger", function () {
      return teamcity.buildConfigurations.isTriggerDisabled({id: "BuildConfigurations_EnabledTrigger"}, "vcsTrigger")
          .then(function (result) {
            expect(result).to.have.property("disabled", false);
          });
    });
  });


  describe("#disableTrigger()", function () {

    it("with an enabled trigger", function () {
      return teamcity.buildConfigurations.disableTrigger({id: "BuildConfigurations_DisableTriggerEnabled"}, "vcsTrigger")
          .then(function (result) {
            expect(result).to.have.property("disabled", true);
          });
    });

    it("with a disabled trigger", function () {
      return teamcity.buildConfigurations.disableTrigger({id: "BuildConfigurations_DisableTriggerDisabled"}, "vcsTrigger")
          .then(function (result) {
            expect(result).to.have.property("disabled", true);
          });
    });
  });


  describe("#enableTrigger()", function () {

    it("with an enabled trigger", function () {
      return teamcity.buildConfigurations.enableTrigger({id: "BuildConfigurations_EnableTriggerEnabled"}, "vcsTrigger")
          .then(function (result) {
            expect(result).to.have.property("disabled", false);
          });
    });

    it("with a disabled trigger", function () {
      return teamcity.buildConfigurations.enableTrigger({id: "BuildConfigurations_EnableTriggerDisabled"}, "vcsTrigger")
          .then(function (result) {
            expect(result).to.have.property("disabled", false);
          });
    });
  });
});
