'use strict';

var assert = require('assert');
var sinon = require('sinon');
var fs = require('fs');
var rule = require('../lib/rules/yo-rc-home');

describe('global .yo-rc.json rule', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('pass if there is no .yo-rc.json file in user home', function () {
    var mock = this.sandbox.mock(fs);
    mock.expects('existsSync').once().withArgs(rule.yorcPath).returns(false);
    assert(!rule.verify());
    mock.verify();
  });

  it('fail if there is a .yo-rc.json file in user home', function () {
    var mock = this.sandbox.mock(fs);
    mock.expects('existsSync').once().withArgs(rule.yorcPath).returns(true);
    assert.equal(rule.verify(), rule.errors.fileExists());
    mock.verify();
  });
});
