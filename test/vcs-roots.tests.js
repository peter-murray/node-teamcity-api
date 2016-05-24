"use strict";

var util = require("util")
  , expect = require("chai").expect
  , TeamCityAPI = require("../lib/api")
  , testData = require("./config/test-data")
  , nockHelper = require("./nock-helper")
  ;

describe("vcsRoots", function () {

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

  describe("#getAll()", function () {

    it("should retrieve all VCS Roots", function () {
      return teamcity.vcsRoots.getAll()
        .then(function (vcsRoots) {
          expect(vcsRoots).to.exist;
          expect(vcsRoots).to.have.property("TopLevelGitRepository");
        });
    });
  });

  describe("#get()", function () {

    it("should get a VCS Root by id", function () {
      return teamcity.vcsRoots.get("TopLevelGitRepository")
        .then(function (vcsRoot) {
          expect(vcsRoot).to.exist;

          expect(vcsRoot).to.have.property("id", "TopLevelGitRepository");
          expect(vcsRoot).to.have.property("name");
          expect(vcsRoot).to.have.property("vcsName", "jetbrains.git");
          expect(vcsRoot).to.have.property("status");
          expect(vcsRoot).to.have.property("project");

          expect(vcsRoot).to.have.property("properties");
          expect(vcsRoot.properties).to.have.property("authMethod", "PRIVATE_KEY_DEFAULT");
        });
    });
  });

  describe("#create()", function () {

    var vcsRoot = {
      name: "TestVcsRootCreate",
      vcsName: "jetbrains.git",
      properties: {
        property: [
          {name: "agentCleanFilesPolicy", value: "ALL_UNTRACKED"},
          {name: "agentCleanPolicy", value: "ON_BRANCH_CHANGE"},
          {name: "authMethod", value: "PRIVATE_KEY_DEFAULT"},
          {name: "branch", value: "refs/heads/master"},
          {name: "ignoreKnownHosts", value: "true"},
          {name: "push_url", value: "git@github.com:someorg/dummy-repo.git"},
          {name: "submoduleCheckout", value: "CHECKOUT"},
          {name: "teamcity:branchSpec", value: "+:refs/heads/(*)\n+:refs/(pull/*/merge)"},
          {name: "url", value: "https://github.com/someorg/dummy-repo.git"},
          {name: "useAlternates", value: "true"},
          {name: "usernameStyle", value: "USERID"}
        ]
      }
    };

    it("should create a new VCS Root for the Root project", function () {
      return teamcity.vcsRoots.create(vcsRoot)
        .then(function (result) {
          expect(result).to.exist;

          expect(result).to.have.property("id", "Root_TestVcsRootCreate");
          expect(result).to.have.property("name", "TestVcsRootCreate");
          expect(result).to.have.property("vcsName", "jetbrains.git");
          expect(result).to.have.property("status");

          expect(result).to.have.property("project");
          expect(result.project).to.have.property("id", "_Root");

          expect(result).to.have.property("properties");
          expect(result.properties).to.have.property("authMethod", "PRIVATE_KEY_DEFAULT");
          expect(result.properties).to.have.property("branch", "refs/heads/master");
          expect(result.properties).to.have.property("push_url", "git@github.com:someorg/dummy-repo.git");
          expect(result.properties).to.have.property("url", "https://github.com/someorg/dummy-repo.git");
        });
    });

    it("should create a new VCS Root for a child project", function () {
      return teamcity.vcsRoots.create(vcsRoot, "ChildProjectWithVcsRoot")
        .then(function (result) {
          expect(result).to.exist;

          expect(result).to.have.property("project");
          expect(result.project).to.have.property("id", "ChildProjectWithVcsRoot");
        })
    });
  });

  describe("#delete()", function () {

    var vcsRoot;

    beforeEach(function () {
      return teamcity.vcsRoots.create(
        {
          name: "TestDeleteVcsRoot",
          vcsName: "jetbrains.git",
          properties: {
            property: [
              {name: "agentCleanFilesPolicy", value: "ALL_UNTRACKED"},
              {name: "agentCleanPolicy", value: "ON_BRANCH_CHANGE"},
              {name: "authMethod", value: "PRIVATE_KEY_DEFAULT"},
              {name: "branch", value: "refs/heads/master"},
              {name: "ignoreKnownHosts", value: "true"},
              {name: "push_url", value: "git@github.com:someorg/dummy-repo.git"},
              {name: "submoduleCheckout", value: "CHECKOUT"},
              {name: "teamcity:branchSpec", value: "+:refs/heads/(*)\n+:refs/(pull/*/merge)"},
              {name: "url", value: "https://github.com/someorg/dummy-repo.git"},
              {name: "useAlternates", value: "true"},
              {name: "usernameStyle", value: "USERID"}
            ]
          }
        })
        .then(function (result) {
          vcsRoot = result.id;
        });
    });

    it("should delete a VCS Root", function () {
      return teamcity.vcsRoots.delete(vcsRoot)
        .then(function(result) {
          expect(result).to.be.true;
        });
    });
  });

});