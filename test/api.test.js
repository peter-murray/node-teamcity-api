"use strict";

var expect = require("chai").expect
  , TeamCityAPI = require("../lib/api")
  , testData = require("./config/test-data")
  , nockHelper = require("./nock-helper")
  ;

describe("TeamCityAPI", function () {
  var teamcity = new TeamCityAPI(testData.url);

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

  describe("#getVersion()", function () {

    //TODO need the guest and httpAuth variations tested

    it("should obtain the version of TeamCity", function () {
      return teamcity.getVersion()
        .then(function (value) {
          expect(value).to.be.at.least(37176);
        });
    });
  });

  describe("#getApiVersion()", function () {

    //TODO need the guest and httpAuth variations tested

    it("should obtain the API Version", function () {
      return teamcity.getApiVersion()
        .then(function (version) {
          expect(version).to.equal("9.1");
        });
    });
  });
});