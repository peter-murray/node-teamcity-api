"use strict";

var util = require("util");

var hostname = "localhost"
    , port = 8111
    , protocol = "http"
    , username = "pmurray"
    , password = "password"
    , url = util.format("%s://%s:%s", protocol, hostname, port)
    ;

module.exports = {
  parameters: {
    hostname: hostname,
    port: port,
    protocol: protocol
  },

  username: username,
  password: password,
  url: url
};