"use strict";

var expect = require("chai").expect
  , TeamCityAPI = require("../lib/api")
  , testData = require("./config/test-data")
  , nockHelper = require("./nock-helper")
  ;

describe("Builds", function () {
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

  describe("#getBuilds()", function () {

    it("should get builds by count for a named build config", function() {
        var countObj = {count:10}
        return teamcity.builds.getByBuildTypeWithCount({name: "Test"},{dimensions: countObj})
            .then(function (builds) {
                expect(builds).to.exist;
            });
    });

    it("should get builds by count for a build config by id", function() {
        var countObj = {count:10}
        return teamcity.builds.getByBuildTypeWithCount({id: "Test_Config"}, {dimensions: countObj})
            .then(function (builds) {
                expect(builds).to.exist;
            });
    });

    it("should get builds by count for a project by id", function() {
        var countObj = {count:10}
        return teamcity.builds.getByProjectWithCount({project: "TestProject"}, {dimensions: countObj})
            .then(function(builds) {
                expect(builds).to.exist;
            });
    });

    it("should get build by its id", function() {
        return teamcity.builds.get({id: 1001})
            .then(function (builds) {
                expect(builds).to.exist;
            });
    });

    });
});