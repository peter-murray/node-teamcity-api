"use strict";

var util = require("util")
  , APIEndpoint = require("../api-endpoint")
  , buildTypeLocator = require("../locators/build-type-locator")
  , subSettingLocator = require("../locators/build-type-setting")
  , vcsRootLocator = require("../locators/vcs-root")
  ;

function getBuildConfiguration() {
  return new APIEndpoint()
    .get()
    .uri("buildTypes/{locator}")
    .pureJson()
    .locator({name: "locator", validator: buildTypeLocator});
}

function pauseBuildConfiguration() {
  return new APIEndpoint()
    .put()
    .uri("buildTypes/{locator}/paused")
    .locator({name: "locator", validator: buildTypeLocator})
    .payload(pausePayload)
    .postProcess(function (str) {
      return {paused: str == "true"};
    });
}

function isPaused() {
  return new APIEndpoint()
    .get()
    .uri("buildTypes/{locator}/paused")
    .locator({name: "locator", validator: buildTypeLocator})
    .postProcess(function (str) {
      return {paused: str == "true"};
    });
}

function getVcsRootEntries() {
  return new APIEndpoint()
    .get()
    .uri("buildTypes/{locator}/vcs-root-entries")
    .acceptJson()
    .locator({name: "locator", validator: buildTypeLocator})
    .postProcess(vcsRootEntries)
    ;
}

function addVcsRootEntry() {
  return new APIEndpoint()
    .post()
    .uri("buildTypes/{locator}/vcs-root-entries")
    .locator({name: "locator", validator: buildTypeLocator})
    .pureJson()
    .payload(vcsRootPayload)
    .postProcess(attachVcsRootResult)
    ;
}

function removeVcsRootEntry() {
  return new APIEndpoint()
    .delete()
    .uri("buildTypes/{locator}/vcs-root-entries/{vcsRootIdLocator}")
    .statusCode(204)
    .locator({name: "locator", validator: buildTypeLocator})
    .locator({name: "vcsRootIdLocator", validator: vcsRootIdLocator})
    .postProcess(returnTrue)
    .errorHandler(missingVcsRootHandler)
    ;
}

function createBuildConfiguration() {
  return new APIEndpoint()
    .post()
    .uri("buildTypes")
    .pureJson()
    ;
}

function deleteBuildConfiguration() {
  return new APIEndpoint()
    .delete()
    .uri("buildTypes/{locator}")
    .locator({name: "locator", validator: buildTypeLocator})
    .statusCode(204)
    .postProcess(returnTrue)
    .errorHandler(missingBuildConfigurationHandler)
    ;
}

function getTemplateAssociation() {
  return new APIEndpoint()
    .get()
    .uri("buildTypes/{locator}/template")
    .locator({name: "locator", validator: buildTypeLocator})
    .pureJson()
    .errorHandler(buildTemplateAssociationHandler)
    ;
}

function setTemplateAssociation() {
  return new APIEndpoint()
    .put()
    .uri("buildTypes/{locator}/template")
    .locator({name: "locator", validator: buildTypeLocator})
    .acceptJson()
    .payload(buildTemplatePayload)
    ;
}

function deleteTemplateAssociation() {
  return new APIEndpoint()
    .delete()
    .uri("buildTypes/{locator}/template")
    .locator({name: "locator", validator: buildTypeLocator})
    .statusCode(204)
    .postProcess(returnTrue)
    ;
}

function getSubSettings(settingsType) {
  return new APIEndpoint()
    .get()
    .uri("buildTypes/{locator}/" + settingsType)
    .locator({name: "locator", validator: buildTypeLocator})
    .acceptJson()
    ;
}

function setSubSettings(settingsType) {
  return new APIEndpoint()
    .put()
    .uri("buildTypes/{locator}/" + settingsType)
    .locator({name: "locator", validator: buildTypeLocator})
    .acceptJson()
    .payload(genericPayload)
    ;
}

function addSubSetting(settingsType) {
  return new APIEndpoint()
    .post()
    .uri("buildTypes/{locator}/" + settingsType)
    .locator({name: "locator", validator: buildTypeLocator})
    .acceptJson()
    .payload(genericPayload)
    ;
}

function deleteSubSetting(settingsType) {
  return new APIEndpoint()
    .delete()
    .uri("buildTypes/{locator}/" + settingsType + "/{settingId}" )
    .locator({name: "locator", validator: buildTypeLocator})
    .locator({name: "settingId", validator: subSettingLocator})
    .statusCode(204)
    .postProcess(returnTrue)
    ;
}

function disableSubSetting(settingsType) {
  return new APIEndpoint()
    .put()
    .uri("buildTypes/{locator}/" + settingsType + "/{settingId}/disabled" )
    .locator({name: "locator", validator: buildTypeLocator})
    .locator({name: "settingId", validator: subSettingLocator})
    .payload(disablePayload)
    .postProcess(function (str) {
      return {disabled: str == "true"};
    });
}

function isSubSettingDisabled(settingsType) {
  return new APIEndpoint()
    .get()
    .uri("buildTypes/{locator}/" + settingsType + "/{settingId}/disabled" )
    .locator({name: "locator", validator: buildTypeLocator})
    .locator({name: "settingId", validator: subSettingLocator})
    .postProcess(function (str) {
      return {disabled: str == "true"};
    });
}

module.exports = {
  getBuildConfiguration: getBuildConfiguration(),
  pause: pauseBuildConfiguration(),
  isPaused: isPaused(),
  getVcsRoots: getVcsRootEntries(),
  addVcsRoot: addVcsRootEntry(),
  removeVcsRoot: removeVcsRootEntry(),
  createBuildConfiguration: createBuildConfiguration(),
  deleteBuildConfiguration: deleteBuildConfiguration(),
  getTemplateAssociation: getTemplateAssociation(),
  setTemplateAssociation: setTemplateAssociation(),
  deleteTemplateAssociation: deleteTemplateAssociation()
};

function exportSubSetting(settingsType, singular, plural) {
  module.exports['get' + plural] = getSubSettings(settingsType);
  module.exports['set' + plural] = setSubSettings(settingsType);
  module.exports['add' + singular] = addSubSetting(settingsType);
  module.exports['delete' + singular] = deleteSubSetting(settingsType);
  module.exports['disable' + singular] = disableSubSetting(settingsType);
  module.exports['is' + singular + 'Disabled'] = isSubSettingDisabled(settingsType);
}

exportSubSetting('steps', 'Step', 'Steps');
exportSubSetting('artifact-dependencies', 'ArtifactDependency', 'ArtifactDependencies');
exportSubSetting('snapshot-dependencies', 'SnapshotDependency', 'SnapshotDependencies');
exportSubSetting('triggers', 'Trigger', 'Triggers');
exportSubSetting('features', 'Feature', 'Features');
exportSubSetting('agent-requirements', 'AgentRequirement', 'AgentRequirements');

function pausePayload(data) {
  return {
    body: util.format("%s", data.paused),
    type: "text/plain"
  }
}

function disablePayload(data) {
  return {
    body: util.format("%s", data.disabled),
    type: "text/plain"
  }
}

function vcsRootPayload(data) {
  return {
    body: {
      "vcs-root": {
        id: data.id
      }
    },
    type: "application/json"
  };
}

function buildTemplatePayload(data) {
  var templateId = buildTypeLocator(data.templateId);

  return {
    body: templateId.getLocatorValue(),
    type: "text/plain"
  };
}

function genericPayload(data) {
  return {
    body: JSON.stringify(data.payload),
    type: "application/json"
  };
}

function vcsRootEntries(data) {
  var result = {};

  if (data && data["vcs-root-entry"]) {
    data["vcs-root-entry"].forEach(function (vcsRoot) {
      result[vcsRoot.id] = {
        id: vcsRoot.id,
        checkoutRules: vcsRoot["checkoutRules"] || []
      }
    });
  }

  return result;
}

function attachVcsRootResult(data) {
  var result = false;

  if (data && data.id) {
    result = true;
  }
  return result;
}

function vcsRootIdLocator(data) {
  var locator = vcsRootLocator(data);

  return {
    getLocatorValue: function() {
      return locator.getLocatorId();
    }
  }
}

function missingVcsRootHandler(err) {
  if (/Status Code, 404/.test(err.message)) {
    throw new Error("VCS Root is not attached");
  } else {
    throw err;
  }
}

function missingBuildConfigurationHandler(err) {
  if (/Status Code, 404/.test(err.message)) {
    throw new Error("BuildConfiguration")
  } else {
    throw err;
  }
}

function buildTemplateAssociationHandler(err) {
  if (/No template associated/.test(err.message)) {
    return null;
  } else {
    throw err;
  }
}

function returnTrue() {
  return true;
}