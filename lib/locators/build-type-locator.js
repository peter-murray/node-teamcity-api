"use strict";

var util = require("util")
  ;

/*
 buildType:(<buildTypeLocator>) - only the builds of the specified build configuration
 tags:<tags> - ","(comma) - a delimited list of build tags (only builds containing all the specified tags are returned)
 status:<SUCCESS/FAILURE/ERROR> - list builds with the specified status only
 user:(<userLocator>) - limit builds to only those triggered by the user specified
 personal:<true/false/any> - limit builds by a personal flag.
 canceled:<true/false/any> - limit builds by a canceled flag.
 running:<true/false/any> - limit builds by a running flag.
 pinned:<true/false/any> - limit builds by a pinned flag.
 branch:<branch locator> - limit the builds by branch. <branch locator> can be the branch name displayed in the UI, or "(name:<name>,default:<true/false/any>,unspecified:<true/false/any>,branched:<true/false/any>)".
 Note: If a build configuration utilizes feature branches, by default only builds from the default branch are returned. To retrieve all builds, add the following locator: branch:default:any. The whole path will look like this: /httpAuth/app/rest/builds/?locator=buildType:One_Git,branch:default:any
 agentName:<name> - agent name to return only builds ran on the agent with name specified
 sinceBuild:(<buildLocator>) - limit the list of builds only to those after the one specified
 sinceDate:<date> - limit the list of builds only to those started after the date specified. The date should be in the same format as dates returned by REST API (e.g. "20130305T170030+0400").
 project:<project locator> - limit the list to the builds of the specified project (belonging to any build type directly or indirectly under the project)
 count:<number> - serve only the specified number of builds
 start:<number> - list the builds from the list starting from the position specified (zero-based)
 lookupLimit:<number> - limit processing to the latest N builds only. If none of the latest N builds match the other specified criteria of the build locator, 404 response is returned.

 */

var BuildTypeLocator = function () {
  this._data = {};
};

BuildTypeLocator.prototype.id = function (id) {
  var self = this
    , data = self._data
    ;
  data.id = id;
};

BuildTypeLocator.prototype.name = function (name) {
  var self = this
    , data = self._data
    ;
  data.name = name;
};

BuildTypeLocator.prototype.number = function (buildNumber) {
  var self = this
    , data = self._data
    ;
  data.number = buildNumber;
};

BuildTypeLocator.prototype.dimension = function (name, value) {
  var self = this
    , data = self._data
    , dimensions
    ;

  if (!data.dimensions) {
    data.dimensions = {};
  }
  dimensions = data.dimensions;

  //TODO could put extra validation around dimensions, see commments below, as they are different in TC9 and TC10
  dimensions[name] = value;
};

/*
TeamCity 9 dimensions
 buildType:(<buildTypeLocator>) - only the builds of the specified build configuration
 tags:<tags> - ","(comma) - a delimited list of build tags. Only builds containing all the specified tags are returned)
 status:<SUCCESS/FAILURE/ERROR> - list builds with the specified status only
 user:(<userLocator>) - limit builds to only those triggered by the user specified
 personal:<true/false/any> - limit builds by the personal flag.
 canceled:<true/false/any> - limit builds by the canceled flag.
 failedToStart:<true/false/any> -  limit builds by the failed to start flag (since TeamCity 9.1)
 running:<true/false/any> - limit builds by the running flag.
 pinned:<true/false/any> - limit builds by the pinned flag.
 */

/*
TeamCity 10 dimensions
 project:<project locator> - limit the list to the builds of the specified project (belonging to any build type directly under the project).
 affectedProject:<project locator> - limit the list to the builds of the specified project (belonging to any build type directly or indirectly under the project)
 buildType:(<buildTypeLocator>) - only the builds of the specified build configuration

 tag:<tag> - since TeamCity 10 get tagged builds. If a list of tags is specified, e.g. tag:<tag1>, tag:<tag2>, only the builds containing all the specified tags are returned. The legacy tags:<tags> locator is supported for compatibility
 status:<SUCCESS/FAILURE/ERROR> - list builds with the specified status only
 user:(<userLocator>) - limit builds to only those triggered by the user specified
 personal:<true/false/any> - limit builds by the personal flag. By default, perfsonal builds are not included.
 canceled:<true/false/any> - limit builds by the canceled flag. By default, canceled builds are not included.
 failedToStart:<true/false/any> - limit builds by the failed to start flag. By default, canceled builds are not included.
 running:<true/false/any> - limit builds by the running flag. By default, running builds are not included.
 state:running,hanging:true - fetch hanging builds (since TeamCity 10.0)
 pinned:<true/false/any> - limit builds by the pinned flag.
 branch:<branch locator> - limit the builds by branch. <branch locator> can be the branch name displayed in the UI, or "(name:<name>,default:<true/false/any>,unspecified:<true/false/any>,branched:<true/false/any>)". By default only builds from the default branch are returned. To retrieve all builds, add the following locator: branch:default:any. The whole path will look like this: /httpAuth/app/rest/builds/?locator=buildType:One_Git,branch:default:any
 revision:<REVISION> - find builds by revision, e.g. all builds of the given build configuration with the revision: /httpAuth/app/rest/builds?locator=revision:(REVISION),buildType:(id:BUILD_TYPE_ID). See more information below.
 agentName:<name> - agent name to return only builds ran on the agent with name specified
 sinceBuild:(<buildLocator>) - limit the list of builds only to those after the one specified
 sinceDate:<date> - limit the list of builds only to those started after the date specified. The date should be in the same format as dates returned by REST API (e.g. "20130305T170030+0400").
 queuedDate/startDate/finishDate:(date:<time-date>,build:<build locator>,condition:<before/after>) - filter builds based on the time specified by the build locator, e.g. (finishDate:(date:20151123T203446+0100,condition:after) - (finished after November 23, 2015, 20:34:46)

 count:<number> - serve only the specified number of builds
 start:<number> - list the builds from the list starting from the position specified (zero-based)
 lookupLimit:<number> - limit processing to the latest N builds only (the default is 5000). If none of the latest N builds match the other specified criteria of the build locator, 404 response is returned.
 */

BuildTypeLocator.prototype.getLocatorValue = function () {
  var self = this
    , data = self._data
    , result
    ;

  if (data.id) {
    result = util.format("id:%s", data.id);
  } else if (data.number) {
    result = util.format("number:%s", data.number);
  } else if (data.name) {
    result = util.format("name:%s", encodeURIComponent(data.name));
  } else if (data.dimensions) {
    result = getDimensionsAsString(data.dimensions);
  } else {
    throw new Error("The BuildTypeLocator did not have any valid values to build from");
  }

  return result;
};

module.exports = function (data) {
  var result = new BuildTypeLocator();

  if (data.id) {
    result.id(data.id);
  } else if (data.name) {
    result.name(data.name);
  } else if (data.number) {
    result.number(data.number);
  } else if (data.dimensions) {
    Object.keys(data.dimensions).forEach(function (key) {
      result.dimension(key, data.dimensions[key]);
    })
  } else {
    result.id(data);
  }

  return result;
};

function getDimensionsAsString(dimensions) {
  var values = [];

  Object.keys(dimensions).forEach(function(key) {
    values.push(util.format("%s:%s", key, dimensions[key]));
  });

  return values.join(",");
}