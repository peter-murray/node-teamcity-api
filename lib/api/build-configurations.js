"use strict";

var buildConfigurationEndpoints = require("../endpoints/build-configuration")
  ;

var BuildConfigurations = function(request) {
  this._request = request;
};
module.exports = BuildConfigurations;

BuildConfigurations.prototype.get = function (locator) {
  return  this._request.execute(buildConfigurationEndpoints.getBuildConfiguration, {locator: locator});
};

BuildConfigurations.prototype.pause = function (locator) {
  return pauseBuildConfiguration(this._request, locator, true);
};

BuildConfigurations.prototype.unpause = function (locator) {
  return pauseBuildConfiguration(this._request, locator, false);
};

BuildConfigurations.prototype.isPaused = function (locator) {
  return this._request.execute(buildConfigurationEndpoints.isPaused, {locator: locator});
};

BuildConfigurations.prototype.delete = function(locator) {
  return this._request.execute(buildConfigurationEndpoints.deleteBuildConfiguration, {locator: locator});
};

BuildConfigurations.prototype.attachVcsRoot = function (buildLocator, vcsRootId) {
  return this._request.execute(buildConfigurationEndpoints.addVcsRoot, {locator: buildLocator, id: vcsRootId});
};

BuildConfigurations.prototype.detachVcsRoot = function (locator, vcsRootId) {
  return this._request.execute(buildConfigurationEndpoints.removeVcsRoot, {locator: locator, vcsRootIdLocator: vcsRootId});
};

BuildConfigurations.prototype.getVcsRoots = function (locator) {
  return this._request.execute(buildConfigurationEndpoints.getVcsRoots, {locator: locator});
};

BuildConfigurations.prototype.getAttachedTemplate = function(locator) {
  return this._request.execute(buildConfigurationEndpoints.getTemplateAssociation, {locator: locator});
};

BuildConfigurations.prototype.attachTemplate = function(locator, templateLocator) {
  return this._request.execute(buildConfigurationEndpoints.setTemplateAssociation, {locator: locator, templateId: templateLocator});
};

BuildConfigurations.prototype.detachTemplate = function(locator) {
  return this._request.execute(buildConfigurationEndpoints.deleteTemplateAssociation, {locator: locator});
};

BuildConfigurations.prototype.deleteAllParameters = function(locator) {
  //TODO
};

BuildConfigurations.prototype.deleteParameter = function(locator, parameter) {
  //TODO
};

function protoTypeSubSetting(settingsType, singular, plural) {
    BuildConfigurations.prototype['get' + plural] = function (locator) {
      return this._request.execute(buildConfigurationEndpoints['get' + plural], {locator: locator});
    };
    BuildConfigurations.prototype['set' + plural] = function(locator, payload) {
      return this._request.execute(buildConfigurationEndpoints['set' + plural], {locator: locator, payload: payload});
    };
    BuildConfigurations.prototype['add' + singular] = function(locator, payload) {
      return this._request.execute(buildConfigurationEndpoints['add' + singular], {locator: locator, payload: payload});
    };
    BuildConfigurations.prototype['delete' + singular] = function(locator, settingId) {
      return this._request.execute(buildConfigurationEndpoints['delete' + singular], {locator: locator, settingId: settingId});
    };
    BuildConfigurations.prototype['disable' + singular] = function (locator, settingId) {
      return this._request.execute(buildConfigurationEndpoints['disable' + singular], {locator: locator, settingId: settingId, disabled: true});
    };
    BuildConfigurations.prototype['enable' + singular] = function (locator, settingId) {
      return this._request.execute(buildConfigurationEndpoints['disable' + singular], {locator: locator, settingId: settingId, disabled: false});
    };
    BuildConfigurations.prototype['is' + singular + 'Disabled'] = function (locator, settingId) {
      return this._request.execute(buildConfigurationEndpoints['is' + singular + 'Disabled'], {locator: locator, settingId: settingId});
    };
}

protoTypeSubSetting('steps', 'Step', 'Steps');
protoTypeSubSetting('artifact-dependencies', 'ArtifactDependency', 'ArtifactDependencies');
protoTypeSubSetting('snapshot-dependencies', 'SnapshotDependency', 'SnapshotDependencies');
protoTypeSubSetting('triggers', 'Trigger', 'Triggers');
protoTypeSubSetting('features', 'Feature', 'Features');
protoTypeSubSetting('agent-requirements', 'AgentRequirement', 'AgentRequirements');

function pauseBuildConfiguration(request, locator, pause) {
  return request.execute(buildConfigurationEndpoints.pause, {locator: locator, paused: pause});
}