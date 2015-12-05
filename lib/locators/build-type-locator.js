"use strict";

var util = require("util")
  , url = require("url")
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

  //TODO could put extra validation around the acllowed values for dimensions, see commment above
  dimensions[name] = value;
};

BuildTypeLocator.prototype.getLocatorValue = function () {
  var self = this
    , data = self._data
    , result
    ;

  if (data.id) {
    result = util.format("id:%s", data.id);
  } else if (data.number) {
    result = util.format("number:%s", data.number);
  } else if (data.dimensions) {
    //TODO need to assemble the dimensions into key value strings
    //result = util.format("number:%s", data.number);
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
    result.number(data.name);
  } else if (data.dimensions) {
    Object.keys(data.dimensions).forEach(function (key) {
      result.dimension(key, data.dimensions(key));
    })
  } else {
    result.id(data);
  }

  return result;
};
