"use strict";

var util = require("util")
  , expect = require("chai").expect
  , TeamCityAPI = require("../lib/api")
  , testData = require("./config/test-data")
  , nockHelper = require("./nock-helper")
  ;

describe("Projects", function () {

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

  describe("#getProjects()", function () {

    it("should obtain all the projects", function (done) {
      teamcity.getProjects()
        .then(function (projects) {
          expect(projects).to.exist;

          expect(projects).to.have.property("_Root");
          expect(projects["_Root"]).to.have.property("name", "<Root project>");

          done();
        })
        .done();
    });
  });

  describe("#getProject()", function () {

    it("should find the root project by ID", function (done) {
      teamcity.getProject({id: "_Root"})
        .then(function (project) {
          expect(project).to.exist;
          expect(project).to.have.property("id", "_Root");
          done();
        })
        .done();
    });

    it("should find the root project by name", function (done) {
      teamcity.getProject({name: "<Root project>"})
        .then(function (project) {
          expect(project).to.exist;
          expect(project).to.have.property("id", "_Root");
          done();
        })
        .done();
    });
  });

  describe("#createProject()", function () {

    it("should create a project under id:_Root", function (done) {
      var projectName = "Project 1448361890414";

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

  describe("#setProjectParameter()", function () {

    it("should set parameter 'myTestValue' on <Root project>", function (done) {
      var tsValue = 1448369904648;

      teamcity.setProjectParameter({name: "<Root project>"}, "myTestValue", tsValue)
        .then(function (result) {
          expect(result).to.exist;
          expect(result).to.have.property("name", "myTestValue");
          expect(result).to.have.property("value", "" + tsValue);
          done();
        })
        .done();
    });
  });

  describe("#setProjectParameters()", function () {

    it("should set a number of parameters", function (done) {
      var time = 1448361890483;

      function propertyValidator(properties) {
        return {
          propertyCount: function () {
            return Object.keys(properties).length;
          },
          hasProperty: function (name, value) {
            expect(properties).to.have.property(name);
            expect(properties[name]).to.have.property("value", value);
            expect(properties[name]).to.have.property("own", true);
          }
        };
      }

      teamcity.setProjectParameters({id: "ParametersTestProject"},
        [
          {name: "p1", value: time},
          {name: "p2", value: time},
          {name: "p3", value: time},
          {name: "p4", value: time},
        ])
        .then(function (results) {
          var validator = propertyValidator(results);

          expect(validator.propertyCount()).to.be.at.least(4);

          validator.hasProperty("p1", "" + time);
          validator.hasProperty("p2", "" + time);
          validator.hasProperty("p3", "" + time);
          validator.hasProperty("p4", "" + time);

          done();
        })
        .done();
    });
  });

  describe("#getProjectParamters()", function () {

    it("should get the parameters of the <Root project>", function (done) {
      teamcity.getProjectParameters({id: "_Root"})
        .then(function (parameters) {
          expect(parameters).to.exist;

          expect(parameters).to.have.property("timestamp");
          expect(parameters.timestamp).to.have.property("own", true);

          done();
        })
        .done();
    });
  });

  describe("#createBuildConfiguration()", function () {

    it("should create an empty BuildConfiguration", function (done) {
      var time = 1448434304622
        , buildName = util.format("Build:%s", time)
        ;

      teamcity.createBuildConfiguration({id: "BuildConfigurationTests"}, buildName)
        .then(function (result) {
          expect(result).to.exist;

          expect(result).to.have.property("id", util.format("BuildConfigurationTests_Build%s", time));
          expect(result).to.have.property("name", buildName);

          expect(result).to.have.property("projectId", "BuildConfigurationTests");

          done();
        })
        .done();
    });

    it("should fail to create under the Root Project", function() {
      function create() {
        teamcity.createBuildConfiguration({id: "_Root"}, "buildThatCannotExist")
          .done();
      }

      expect(create).to.throw(/cannot create a build configuration/i);
    });
  });

  describe("#createBuildTemplate()", function () {

    it("should create an empty Build Template", function (done) {
      var time = 1448370750225
        , buildName = util.format("BuildTemplate:%s", time)
        ;

      teamcity.createBuildTemplate({id: "BuildTemplateTests"}, buildName)
        .then(function (result) {
          expect(result).to.exist;

          expect(result).to.have.property("id", util.format("BuildTemplateTests_BuildTemplate%s", time));
          expect(result).to.have.property("name", buildName);

          expect(result).to.have.property("projectId", "BuildTemplateTests");

          done();
        })
        .done();
    });
  });

  describe("#getBuildTemplates()", function () {

    it("should get the templates for the Root Project", function (done) {
      teamcity.getBuildTemplates()
        .then(function (templates) {
          expect(templates).to.exist;

          expect(templates).to.have.property("TopLevelTemplate");

          expect(templates["TopLevelTemplate"]).to.have.property("id");
          expect(templates["TopLevelTemplate"]).to.have.property("name");
          expect(templates["TopLevelTemplate"]).to.have.property("projectId");
          done();
        })
        .done();
    });

    it("should get the templates for 'BuildTemplateTests'", function (done) {
      teamcity.getBuildTemplates({id: "BuildTemplateTests"})
        .then(function (templates) {
          expect(templates).to.exist;
          expect(Object.keys(templates)).to.have.length.greaterThan(0);
          done();
        })
        .done();
    })
  });

  describe("#moveProject()", function () {

    it("should move an existing Project", function (done) {
      //var project = {id: "MoveProject"}
      teamcity.createProject("MoveProject")
        .then(function (project) {
          expect(project).to.have.property("parentProjectId", "_Root");

          return teamcity.moveProject({id: project.id}, {id: "ProjectMoveTarget"});
        })
        //teamcity.moveProject({id: project.id}, {id: "ProjectMoveTarget"})
        .then(function (movedProject) {
          expect(movedProject).to.exist;
          expect(movedProject).to.have.property("parentProjectId", "ProjectMoveTarget");
          done();
        })
        .done();
    });
  });

  describe("#deleteProject()", function () {

    it("should delete an existing project", function (done) {
      var name = "ProjectToDelete";

      teamcity.createProject(name, "_Root")
        .then(function (project) {
          return teamcity.deleteProject(project.id);
        })
        .then(function (result) {
          expect(result).to.be.true;
          done();
        })
        .done();
    });
  });

  describe("#deleteAllProjectParameters()", function () {

    it("should remove all existing parameters", function (done) {
      var projectLocator = {id: "ParametersTestProject"};

      teamcity.setProjectParameter(projectLocator, "parameter_one", "value")
        .then(function (result) {
          expect(result).to.have.property("name", "parameter_one");
          expect(result).to.have.property("own", true);

          return teamcity.deleteAllProjectParameters(projectLocator);
        })
        .then(function (result) {
          expect(result).to.be.true;
          done();
        })
        .done();
    });
  });
});