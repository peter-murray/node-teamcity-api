"use strict";

var nock = require("nock")
  , nockBack = nock.back
  ;

var ctxMap = {};

nockBack.fixtures = __dirname + "/nock";
nockBack.setMode("wild");

module.exports.record = function () {
  nockBack.setMode("record");
};

module.exports.reset = function () {
  nockBack.setMode("wild");
};

module.exports.dryrun = function () {
  nockBack.setMode("dryrun");
};

module.exports.beforeEach = function (ctx) {
  var test = getTestPath(ctx.currentTest)
    , testTitle = getTestTitle(ctx)
    ;

  nock.cleanAll();

  nockBack(test, function (done) {
    ctxMap[testTitle] = done;
  });
};

module.exports.afterEach = function (ctx) {
  var test = getTestTitle(ctx)
    , nockDone = ctxMap[test]
    ;

  if (nockDone) {
    nockDone();
    delete ctx[test];
  }
};

function getTestTitle(ctx) {
  return ctx.currentTest ? ctx.currentTest.fullTitle() : ctx.test.fullTitle();
}

function getTestPath(test) {
  var parent = test.parent
    , path = []
    ;

  while (parent.title) {
    path.unshift(parent.title);
    parent = parent.parent;
  }

  path.push(test.title);
  return path.join("/");
}