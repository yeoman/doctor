'use strict';

var assert = require('assert');
var sinon = require('sinon');
var fs = require('fs');
var rule = require('../lib/rules/bowerrc-home');

describe('global .bowerrc rule', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('pass if there is no .bowerrc file in user home', function () {
    var mock = this.sandbox.mock(fs);
    mock.expects('existsSync').once().withArgs(rule.bowerrcPath).returns(false);
    assert(!rule.verify());
    mock.verify();
  });

  it('fail if there is a .bowerrc file in user home', function () {
    var mock = this.sandbox.mock(fs);
    mock.expects('existsSync').once().withArgs(rule.bowerrcPath).returns(true);
    assert.equal(rule.verify(), rule.errors.fileExists());
    mock.verify();
  });
});
