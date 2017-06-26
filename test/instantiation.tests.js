"use strict";

var expect = require("chai").expect
  , TeamCityAPI = require("../lib/api")
  , testData = require("./config/test-data")
  ;

describe("TeamCityAPI", function () {

  describe("instantiation", function () {

    it("should work with valid parameters", function () {
      var teamcity = new TeamCityAPI(testData.parameters);

      expect(teamcity).to.exist;

      expectPort(teamcity, 8111);
      expectHostname(teamcity, "localhost");
      expectProtocol(teamcity, "http");
    });

    it("should fail wth no parameters", function () {
      var fn = function () {
        return new TeamCityAPI({})
      };

      expect(fn).to.throw(/Required parameter .* was not provided/);
    });

    it("should work with 'http://localhost:8111'", function () {
      var teamcity = new TeamCityAPI(testData.url);

      expectPort(teamcity, 8111);
      expectHostname(teamcity, "localhost");
      expectProtocol(teamcity, "http");
    });

    it("should work with 'https://teamcity.mydomain.com'", function () {
      var teamcity = new TeamCityAPI("https://teamcity.mydomain.com");

      expectPort(teamcity, 443);
      expectHostname(teamcity, "teamcity.mydomain.com");
      expectProtocol(teamcity, "https");
    });

    it("should be able to be created from an object with a URL", function () {
      var teamcity = new TeamCityAPI(testData);

      expectPort(teamcity, 8111);
      expectHostname(teamcity, "localhost");
      expectProtocol(teamcity, "http");
    });

    it("should fail with only a hostname", function() {
      var fn = function () {
        return new TeamCityAPI({hostname: "localhost"})
      };

      expect(fn).to.throw(/Required parameter .* was not provided/);
    });
  });
});

function expectPort(tc, expected) {
  expectConfigValue(tc, "port", expected);
}

function expectHostname(tc, expected) {
  expectConfigValue(tc, "hostname", expected);
}

function expectProtocol(tc, expected) {
  expectConfigValue(tc, "protocol", expected);
}

function expectConfigValue(tc, name, value) {
  var config;

  expect(tc).to.exist;

  config = tc._getConfig();
  expect(config).to.have.property(name, value);
}