"use strict";

var util = require("util")
    , expect = require("chai").expect
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

  describe("#createBuildConfiguration()", function() {

    it("should create an empty BuildConfiguration", function(done) {
      var time = new Date().getTime()
          , buildName = util.format("Build:%s", time)
          ;

      teamcity.createBuildConfiguration({id: "BuildConfigurationTests"}, buildName)
          .then(function(result) {
            expect(result).to.exist;

            expect(result).to.have.property("id", util.format("BuildConfigurationTests_Build%s", time));
            expect(result).to.have.property("name", buildName);

            expect(result).to.have.property("projectId", "BuildConfigurationTests");

            done();
          })
          .done();
    });
  });

  describe("#createBuildTemplate()", function() {

    it("should create an empty Build Template", function(done) {
      var time = new Date().getTime()
          , buildName = util.format("BuildTemplate:%s", time)
          ;

      teamcity.createBuildTemplate({id: "BuildTemplateTests"}, buildName)
          .then(function(result) {
            expect(result).to.exist;

            expect(result).to.have.property("id", util.format("BuildTemplateTests_BuildTemplate%s", time));
            expect(result).to.have.property("name", buildName);

            expect(result).to.have.property("projectId", "BuildTemplateTests");

            done();
          })
          .done();
    });
  });

  describe("#getBuildTemplates()", function() {

    it("should get the templates for the Root Project", function(done) {
      teamcity.getBuildTemplates()
          .then(function(templates) {
            expect(templates).to.exist;

            expect(templates).to.have.property("TopLevelTemplate");

            expect(templates["TopLevelTemplate"]).to.have.property("id");
            expect(templates["TopLevelTemplate"]).to.have.property("name");
            expect(templates["TopLevelTemplate"]).to.have.property("projectId");
            done();
          })
          .done();
    });

    it("should get the templates for 'BuildTemplateTests'", function(done) {
      teamcity.getBuildTemplates({id: "BuildTemplateTests"})
          .then(function(templates) {
            expect(templates).to.exist;
            expect(Object.keys(templates)).to.have.length.greaterThan(0);
            done();
          })
          .done();
    })
  });

  describe("#moveProject()", function() {

    it("should move an existing Project", function(done) {
      teamcity.createProject("MoveProject" + new Date().getTime())
          .then(function(project) {
            expect(project).to.have.property("parentProjectId", "_Root");

            return teamcity.moveProject({id: project.id}, {id: "ProjectMoveTarget"});
          })
          .then(function(movedProject) {
            expect(movedProject).to.exist;
            expect(movedProject).to.have.property("parentProjectId", "ProjectMoveTarget");
            done();
          })
          .done();
    });
  });

  describe("#deleteProject()", function() {

    it("should delete an existing project", function(done) {
      var time  = new Date().getTime()
          , name = "ProjectToDelete:" + time
          ;

      teamcity.createProject(name, "_Root")
          .then(function(project) {
            return teamcity.deleteProject(project.id);
          })
          .then(function(result) {
            expect(result).to.be.true;
            done();
          })
          .done()
          ;
    });
  });

});