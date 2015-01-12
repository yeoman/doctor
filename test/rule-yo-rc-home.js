'use strict';
var fs = require('fs');
var assert = require('assert');
var sinon = require('sinon');
var rule = require('../lib/rules/yo-rc-home');

describe('global .yo-rc.json rule', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('pass if there is no .yo-rc.json file in user home', function (done) {
    var mock = this.sandbox.mock(fs);
    mock.expects('exists').once().withArgs(rule.yorcPath).yields(false);
    rule.verify(function (error) {
      assert(!error);
      mock.verify();
      done();
    });
  });

  it('fail if there is a .yo-rc.json file in user home', function (done) {
    var mock = this.sandbox.mock(fs);
    mock.expects('exists').once().withArgs(rule.yorcPath).yields(true);
    rule.verify(function (error) {
      assert.equal(error, rule.errors.fileExists());
      mock.verify();
      done();
    });
  });
});
