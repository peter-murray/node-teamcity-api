"use strict";

var util = require("util")
    , APIEndpoint = require("../api-endpoint")
    , projectLocator = require("../locators/project")
    ;

function getProjects() {
  return new APIEndpoint().get().uri("projects").pureJson().postProcess(convertProjects);
}

function getProject() {
  return new APIEndpoint()
      .get()
      .uri("projects/{locator}")
      .pureJson()
      .locator({name: "locator", validator: projectLocator});
}

function createProject() {
  return new APIEndpoint()
      .post()
      .uri("projects")
      .payload(projectPayload)
      .acceptJson();
}

function deleteProject() {
  return new APIEndpoint()
      .delete()
      .uri("projects/{locator}")
      .statusCode(204)
      .locator({name: "locator", validator: projectLocator})
      .postProcess(function() {return true;})
}

function setParameter() {
  return new APIEndpoint()
      .post()
      .uri("projects/{locator}/parameters")
      .locator({name: "locator", validator: projectLocator})
      .payload(parameterPayload)
      .pureJson();
}

function getParameters() {
  return new APIEndpoint()
      .get()
      .uri("projects/{locator}/parameters")
      .locator({name: "locator", validator: projectLocator})
      .pureJson()
      .postProcess(convertParameters);
}

function setParameters() {
  return new APIEndpoint()
      .put()
      .uri("projects/{locator}/parameters")
      .locator({name: "locator", validator: projectLocator})
      .payload(parametersPayload)
      .pureJson()
      .postProcess(convertParameters);
}

function deleteParameters() {
  return new APIEndpoint()
      .delete()
      .uri("projects/{locator}/parameters")
      .locator({name: "locator", validator: projectLocator})
      .statusCode(204)
      .postProcess(function() { return true; })
}

function createBuildConfiguration() {
  return new APIEndpoint()
      .post()
      .uri("/projects/{locator}/buildTypes")
      .acceptJson()
      .locator({name: "locator", validator: projectLocator})
      .payload(buildConfigurationPayload)
      ;
}

function setParentProject() {
  return new APIEndpoint()
      .put()
      .uri("projects/{locator}/parentProject")
      .pureJson()
      .locator({name: "locator", validator: projectLocator})
      .payload(parentProjectPayload)
      ;
}

function createBuildTemplate() {
  return new APIEndpoint()
      .post()
      .uri("projects/{locator}/templates")
      .acceptJson()
      .locator({name: "locator", validator: projectLocator})
      .payload(buildConfigurationPayload)
      ;
}

function getBuildTemplates() {
  return new APIEndpoint()
      .get()
      .uri("projects/{locator}/templates")
      .pureJson()
      .locator({name: "locator", validator: projectLocator})
      .postProcess(convertTemplates)
      ;
}

module.exports = {
  projects: getProjects(),
  project: getProject(),
  createProject: createProject(),
  setParameter: setParameter(),
  setParameters: setParameters(),
  getParameters: getParameters(),
  deleteAllParameters: deleteParameters(),
  createBuildConfiguration: createBuildConfiguration(),
  createBuildTemplate: createBuildTemplate(),
  getBuildTemplates: getBuildTemplates(),
  moveProject: setParentProject(),
  deleteProject: deleteProject()
};

function parameterPayload(data) {
  return {
    body: getParameterEntry(data.name, data.value),
    type: "application/json"
  }
}

function parametersPayload(data) {
  var parameters = [];

  if (data.parameters) {
    data.parameters.forEach(function(parameter) {
      parameters.push(getParameterEntry(parameter.name, parameter.value));
    })
  }

  return {
    body: {property: parameters},
    type: "application/json"
  };
}

function getParameterEntry(name, value) {
  return {name: name, value: "" + value};
}

function projectPayload(data) {
  var body = util.format(
    '<newProjectDescription name="%s"><parentProject locator="id:%s" /></newProjectDescription>',
    data.name,
    data.parentId
  );

  return {
    body: body,
    type: "application/xml"
  }
}

function buildConfigurationPayload(data) {
  return {
    body: util.format("%s", data.name),
    type: "text/plain"
  }
}

function parentProjectPayload(data) {
  return {
    body: {id: data.parent.id},
    type: "application/json"
  }
}

function convertProjects(data) {
  var result = {};

  if (data && data.project) {
    data.project.forEach(function (project) {
      result[project.id] = {
        name: project.name,
        description: project.description,
        id: project.id
      };
    });
  }

  return result;
}

function convertParameters(data) {
  var result = {};

  if (data && data.property) {
    data.property.forEach(function (property) {
      result[property.name] = {
        value: property.value,
        own: property.own
      };
    })
  }

  return result;
}

function convertTemplates(data) {
  var result = {};

  if (data && data.buildType) {
    data.buildType.forEach(function(template) {
      result[template.id] = template;
    });
  }

  return result;
}
