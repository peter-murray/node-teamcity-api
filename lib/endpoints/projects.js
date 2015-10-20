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

module.exports = {
  projects: getProjects(),
  project: getProject(),
  createProject: createProject(),
  setParameter: setParameter(),
  getParameters: getParameters()
};


function parameterPayload(data) {
  return {
    body: {name: data.name, value: data.value},
    type: "application/json"
  }
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