"use strict";

var util = require("util")
  , expect = require("chai").expect
  , TeamCityAPI = require("../lib/api")
  , testData = require("./config/test-data")
  , nockHelper = require("./nock-helper")
  ;

describe("#projects", function () {

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

    it("should obtain all the projects", function () {
      return teamcity.projects.getAll()
        .then(function (projects) {
          expect(projects).to.exist;

          expect(projects).to.have.property("_Root");
          expect(projects["_Root"]).to.have.property("name", "<Root project>");
        });
    });
  });

  describe("#get()", function () {

    it("should find the root project by ID", function () {
      return teamcity.projects.get({id: "_Root"})
        .then(function (project) {
          expect(project).to.exist;
          expect(project).to.have.property("id", "_Root");
        })
    });

    it("should find the root project by name", function () {
      return teamcity.projects.get({name: "<Root project>"})
        .then(function (project) {
          expect(project).to.exist;
          expect(project).to.have.property("id", "_Root");
        });
    });
  });

  describe("#create()", function () {

    it("should create a project under id:_Root", function () {
      var projectName = "Project Creation Test";

      return teamcity.projects.create(projectName, "_Root")
        .then(function (result) {
          expect(result).to.exist;

          expect(result).to.have.property("name", projectName);
          expect(result).to.have.property("parentProjectId", "_Root");
        });
    });
  });

  describe("#setParameter()", function () {

    it("should set parameter 'myTestValue' on <Root project>", function () {
      var tsValue = 1448369904648;

      return teamcity.projects.setParameter({name: "<Root project>"}, "myTestValue", tsValue)
        .then(function (result) {
          expect(result).to.exist;
          expect(result).to.have.property("name", "myTestValue");
          expect(result).to.have.property("value", "" + tsValue);
        });
    });

    it("should set parameter 'myTestValueString' on <Root project>", function () {
      var tsValue = "Test String Value";

      return teamcity.projects.setParameter({name: "<Root project>"}, "myTestValueString", tsValue)
        .then(function (result) {
          expect(result).to.exist;
          expect(result).to.have.property("name", "myTestValueString");
          expect(result).to.have.property("value", "" + tsValue);
        });
    });
  });

  describe("#setParameters()", function () {

    it("should set a number of parameters", function () {
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

      return teamcity.projects.setParameters({id: "ParametersTestProject"},
        [
          {name: "p1", value: time},
          {name: "p2", value: time},
          {name: "p3", value: time},
          {name: "p4", value: time}
        ])
        .then(function (results) {
          var validator = propertyValidator(results);

          expect(validator.propertyCount()).to.be.at.least(4);

          validator.hasProperty("p1", "" + time);
          validator.hasProperty("p2", "" + time);
          validator.hasProperty("p3", "" + time);
          validator.hasProperty("p4", "" + time);
        });
    });
  });

  describe("#getParameters()", function () {

    it("should get the parameters of the <Root project>", function () {
      return teamcity.projects.getParameters({id: "_Root"})
        .then(function (parameters) {
          expect(parameters).to.exist;

          expect(parameters).to.have.property("timestamp");
          expect(parameters.timestamp).to.have.property("own", true);
        });
    });
  });

  describe("#createBuildConfiguration()", function () {

    it("should create an empty BuildConfiguration", function () {
      var time = 1448434304622
        , buildName = util.format("Build:%s", time)
        ;

      return teamcity.projects.createBuildConfiguration({id: "BuildConfigurationTests"}, buildName)
        .then(function (result) {
          expect(result).to.exist;

          expect(result).to.have.property("id", util.format("BuildConfigurationTests_Build%s", time));
          expect(result).to.have.property("name", buildName);

          expect(result).to.have.property("projectId", "BuildConfigurationTests");
        });
    });

    it("should fail to create under the Root Project", function() {
      function create() {
        return teamcity.projects.createBuildConfiguration({id: "_Root"}, "buildThatCannotExist")
      }

      expect(create).to.throw(/cannot create a build configuration/i);
    });
  });

  describe("#createBuildTemplate()", function () {

    it("should create an empty Build Template", function () {
      var time = 1448370750225
        , buildName = util.format("BuildTemplate:%s", time)
        ;

      return teamcity.projects.createBuildTemplate({id: "BuildTemplateTests"}, buildName)
        .then(function (result) {
          expect(result).to.exist;

          expect(result).to.have.property("id", util.format("BuildTemplateTests_BuildTemplate%s", time));
          expect(result).to.have.property("name", buildName);

          expect(result).to.have.property("projectId", "BuildTemplateTests");
        });
    });
  });

  describe("#getBuildTemplates()", function () {

    it("should get the templates for the Root Project", function () {
      return teamcity.projects.getBuildTemplates()
        .then(function (templates) {
          expect(templates).to.exist;

          expect(templates).to.have.property("TopLevelTemplate");

          expect(templates["TopLevelTemplate"]).to.have.property("id");
          expect(templates["TopLevelTemplate"]).to.have.property("name");
          expect(templates["TopLevelTemplate"]).to.have.property("projectId");
        });
    });

    it("should get the templates for 'BuildTemplateTests'", function () {
      return teamcity.projects.getBuildTemplates({id: "BuildTemplateTests"})
        .then(function (templates) {
          expect(templates).to.exist;
          expect(Object.keys(templates)).to.have.length.greaterThan(0);
        });
    })
  });

  describe("#move()", function () {

    it("should move an existing Project", function () {
      //var project = {id: "MoveProject"}
      return teamcity.projects.create("MoveProject")
        .then(function (project) {
          expect(project).to.have.property("parentProjectId", "_Root");

          return teamcity.projects.move({id: project.id}, {id: "ProjectMoveTarget"});
        })
        //teamcity.moveProject({id: project.id}, {id: "ProjectMoveTarget"})
        .then(function (movedProject) {
          expect(movedProject).to.exist;
          expect(movedProject).to.have.property("parentProjectId", "ProjectMoveTarget");
        });
    });
  });

  describe("#delete()", function () {

    it("should delete an existing project", function () {
      var name = "ProjectToDelete";

      return teamcity.projects.create(name, "_Root")
        .then(function (project) {
          return teamcity.projects.delete(project.id);
        })
        .then(function (result) {
          expect(result).to.be.true;
        });
    });
  });

  describe("#deleteAllParameters()", function () {

    it("should remove all existing parameters", function () {
      var projectLocator = {id: "ParametersTestProject"};

      return teamcity.projects.setParameter(projectLocator, "parameter_one", "value")
        .then(function (result) {
          expect(result).to.have.property("name", "parameter_one");
          expect(result).to.have.property("own", true);

          return teamcity.projects.deleteAllParameters(projectLocator);
        })
        .then(function (result) {
          expect(result).to.be.true;
        });
    });
  });
});
