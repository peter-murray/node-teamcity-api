# Node.js TeamCity REST API Library

A Node.js API wrapper around the TeamCity RESTful API.

## Installation
To use the library in Node.js, install it using npm:

```npm install teamcity-rest-api```

## API Style
This API is written to support promises, and future work will be done to introduce callback support as well, but for now
the primary use case was for integration with other software using promises.

## Examples


## Connecting to a TeamCity Server

You can instantiate the TeamCity client using the `create()` function with either a URL or a configuration object.

If attempting to connect as a user (and not using the guest RESTful API connection), you will
have to use a configuration object.

### Connecting Using a URL

```js
var TeamCityAPI = require("teamcity-rest-api");

var teamcity = new TeamCityAPI({});
```

### Connecting Using a Configuration Object

A configuration object can be used pass in a number of parameters, some are optional, like the authentication details.
You must either pass in a `url` or a combination of `protocol`, `hostname` and `port`.

Using a `url` with some authentication details:
```js
var teamcityAPI = require("teamcity-rest-api");

// Using a URL, and authentication
var teamcity = teamcityAPI.create({
  url: "http://localhost:8111",
  username: "admin",
  password: "a secret"
  });
```

Using `protocol`, `hostname`, `port` instead of a `url`:
```js
var teamcityAPI = require("teamcity-rest-api");

// Using protocol, hostname and port
var teamcity = teamcityAPI.create({
  protocol: "https"
  hostname: "localhost",
  port: 8111
  });
```

If no authentication details are provided the connection to TeamCity will be performed as a guest. This will require
guest access to be turned on in the TeamCity Server. If using guest access, some API endpoints may be unavailable, based
on the access settings of the TeamCity Server.

User authentication details can be provided using `user` or `username` for the username to connect as and
`password` or `pass` for the password for the user. Both a username and password must be provided for the API to attempt to
connect with the TeamCity Server, oterhwise it will fall back to using a guest connection.

## TeamCity Version Numbers
The TeamCity Server has two version numbers that it can report once connected. These are available as a guest or an
authenticated user.

The two version numbers are that of the TeamCity Server software and the other being that of the RESTful API version.

### Getting the TeamCity Version

```js
var teamcityAPI = require("teamcity-rest-api")
  , teamcity = teamcityAPI.create("http://localhost:8111")
  ;

teamcity.getVersion()
  .then(function(version) {
    console.log("TeamCity Server version: " + version);
  })
  .done();
```