"use strict";

var expect = require("chai").expect
    , TeamCityAPI = require("../lib/api")
    , testData = require("./config/test-data")
    ;

describe("Projects", function() {

  var teamcity = new TeamCityAPI(testData);

  describe("#getProjects()", function() {

    it("should obtain all the projects", function(done) {
      teamcity.getProjects()
          .then(function(projects) {
            expect(projects).to.exist;

            expect(projects).to.have.property("_Root");
            expect(projects["_Root"]).to.have.property("name", "<Root project>");

            done();
          })
          .done();
    });
  });

  describe("#getProject()", function() {

    it("should find the root project by ID", function(done) {
      teamcity.getProject({id: "_Root"})
          .then(function(project) {
            expect(project).to.exist;
            //console.log(JSON.stringify(project, null, 2))
            //TODO need validation
            done();
          })
          .done();
    });

    it ("should find the root project by name", function(done) {
      teamcity.getProject({name: "<Root project>"})
          .then(function(project) {
            expect(project).to.exist;
            //TODO validate content

            expect(project).to.have.property("id", "_Root");

            done();
          })
          .done();
    });
  });

  describe("#createProject()", function() {

    it ("should create a project under id:_Root", function(done) {
      var projectName = "Project " + new Date().getTime();

      teamcity.createProject(projectName, "_Root")
          .then(function (result) {
            expect(result).to.exist;

            expect(result).to.have.property("name", projectName);
            expect(result).to.have.property("parentProjectId", "_Root");
            done();
          })
          .done();
    });
  });

  describe("#setProjectParamter()", function() {

    it("should set parameter 'timestamp' on <Root project>", function(done) {
      var tsValue = new Date().getTime();

      teamcity.setProjectParameter({name: "<Root project>"}, "timestamp", tsValue)
          .then(function(result) {
            expect(result).to.exist;
            expect(result).to.have.property("name", "timestamp");
            expect(result).to.have.property("value", "" + tsValue);
            done();
          })
          .done();
    });
  });

  describe("#getProjectParamters()", function() {

    it("should get the parameters of the <Root project>", function(done) {
      teamcity.getProjectParameters({id: "_Root"})
          .then(function(parameters) {
            expect(parameters).to.exist;

            expect(parameters).to.have.property("timestamp");
            expect(parameters.timestamp).to.have.property("own", true);

            done();
          })
          .done();
    });
  });


});