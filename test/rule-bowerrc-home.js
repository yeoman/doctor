'use strict';
var fs = require('fs');
var assert = require('assert');
var sinon = require('sinon');
var rule = require('../lib/rules/bowerrc-home');

describe('global .bowerrc rule', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('pass if there is no .bowerrc file in user home', function (done) {
    var mock = this.sandbox.mock(fs);
    mock.expects('exists').once().withArgs(rule.bowerrcPath).yields(false);
    rule.verify(function (error) {
      assert(!error);
      mock.verify();
      done();
    });
  });

  it('fail if there is a .bowerrc file in user home', function (done) {
    var mock = this.sandbox.mock(fs);
    mock.expects('exists').once().withArgs(rule.bowerrcPath).yields(true);

    rule.verify(function (error) {
      assert.equal(error, rule.errors.fileExists());
      mock.verify();
      done();
    });
  });
});
