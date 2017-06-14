# Node.js TeamCity REST API Library

A Node.js API wrapper around the TeamCity RESTful API to make it easy to use.

## Installation
To use the library in Node.js, install it using npm:

```npm install teamcity-rest-api```

## API Style
This library has been writtne to support Node.js 4.x and native promises, 
there are no callbacks from any of the functions.


# Examples

## Creating the Client
You can instantiate the API client using the `create()` function with a
`URL` or `configuration` object.

If you use the `URL`, you will be connected to the `guest` RESTful API endpoints.
This will require that you have guest access turned on in the TeamCity Server
that you are connecting to. Note that not all endpoints are accessible
via the `guest` API.

### Connecting Using a URL

```js
var teamcity = require("teamcity-rest-api");

var client = teamcity.create('http://localhost:8111')
```

### Connecting Using a Configuration Object

You must use the `configuration` object if you need to connect to the authenticated
RESTful API endpoints. The `configuration` object allows you to pass in the
username and password values.

The `configuration` object can have a number of properties which consist of:

 * `url` The full URL for the TeamCity server, e.g. http://teamcity.domain.com:8111
 * `protocol` The protocol for the connection, e.g. http
 * `hostname` The hostname of the server, e.g. teamcity.domain.com
 * `port` The port for the TeamCity server, e.g. 8111
 * `username` The username if using authenticated endpoints
 * `password` The password for the user you are authenticating as

You can specify a full `url` or the combination of `protocol`, `hostname` 
and an optional `port` depending upon your needs. If you choose to provide a
`url` along with any other parameters, the `url` will be used and the others
ignored.

If no authentication details are provided (`username` and `password`) the 
connection to TeamCity will be performed as a guest. This will require
guest access to be turned on in the TeamCity Server. If using guest access, 
some API endpoints may be unavailable, based on the access settings of the TeamCity Server.

User authentication details can be provided using `user` or `username` for the 
username to connect as and `password` or `pass` for the password for the user. Both a 
username and password must be provided for the API to attempt to connect with the 
TeamCity server, otherwise it will fall back to using a guest connection.

Connecting to the TeamCity server with a `url` parameter:
```js
var teamcity = require("teamcity-rest-api");

var client = teamcity.create({
    url: "http://localhost:8111",
    username: "user",
    password: "pass"
});
```

Connecting to the TeamCity server with a `protocol`, `hostname` and `port`:
```js
var teamcity = require("teamcity-rest-api");

var client = teamcity.create({
    url: "http://localhost:8111",
    username: "user",
    password: "pass"
});
```

## TeamCity Version Numbers
The TeamCity Server has two version numbers that it can report once connected. These are available as a guest or an
authenticated user.

The two version numbers are that of the TeamCity Server software and the other being that of the RESTful API version.

### Getting the TeamCity Version

```js
var teamcity = require("teamcity-rest-api")
  , client = teamcity.create("http://localhost:8111")
  ;

client.getVersion()
  .then(function(version) {
    console.log("TeamCity Server version: " + version);
  })
  .catch(function(err) {
    console.error(err.message);
  });
```

### TeamCity API Version
The API version is a major.minor version number as a string that matches
the version of TeamCity, e.g. for 9.1.4 it is "9.1".

```js
var teamcity = require("teamcity-rest-api")
  , client = teamcity.create("http://localhost:8111")
  ;

client.getApiVersion()
  .then(function(version) {
    console.log("TeamCity Server version: " + version);
  })
  .catch(function(err) {
    console.error(err.message);
  });
```

## Projects
The API provides a `project` object for interacting with various Project
related activities.

### teamcity.projects.create - Create a Project
To create a project use the `client.projects.create()` function:

```js
var teamcity = require("teamcity-rest-api")
  , client = teamcity.create({
    url: "http://localhost:8111",
    username: "user",
    password: "pass"
  })
  ;

client.projects.create()
  .then(function(project) {
    console.log(JSON.stringify(project, null, 2));
  })
  .catch(function(err) {
    console.error(err.message);
  });
```

## Builds
The API provides a `builds` object to interact with Build Configurations.

### teamcity.builds.get - Get a specific build
```js
client.builds.get({id: 100})
  .then(function(build) {
    console.log(build.state)
  });
```

### teamcity.builds.getByBuildTypeWithCount and getByProjectWithCount - Get a list of builds for a configuration
These methods provide different ways to get a list of builds of a specific build configuration.
To list builds by the name or ID of a build config, use `getByBuildTypeWithCount`.
To list builds for a particular project, use `getByProjectWithCount`.
Both of these methods do not apply default filtering from TeamCity, so you will get in-progress builds as well.

```js
client.builds.getByBuildTypeWithCount({id: "BuildConfigId"}, {dimensions: {count:10}})
  .then(function(buildList){
    console.log(buildList.build[0]) //buildList.build is an array of builds, from most recent to the count parameter
  });

client.builds.getByProjectWithCount({name: "TestBuildProject"}, {dimensions: {count:10}})
  .then(function(buildList){
    console.log(buildList.build[0].id) //build id can be passed to builds.get for more detailed info
  });
```

The TeamCity API documentation has more examples of dimensions that can be passed into these lookups.

### teamcity.builds.startBuild - Run a build configuration.
This method allows you to start a build configuration; It'll return the build number of the running build.

```js
var buildNodeObject = "<build> <buildType id=\"TestConfigId\" /> </build>"
client.builds.startBuild(buildNodeObject)
  .then(function(buildStatus) {
    console.log(buildStatus.id)
  });
```

Refer to the TeamCity REST API documentation for more info on what can be passed as a buildNode.
