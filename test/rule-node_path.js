'use strict';

var assert = require('assert');
var sinon = require('sinon');
var shell = require('shelljs');
var rule = require('../lib/rules/node_path');

describe('NODE_PATH rule', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
    this.beforePath = process.env.NODE_PATH;
  });

  afterEach(function () {
    this.sandbox.restore();
    process.env.NODE_PATH = this.beforePath;
  });

  it('pass if npm root is contained in NODE_PATH', function () {
    this.sandbox.stub(shell, 'exec').returns({
      code: 0,

      // Make sure we clean the output
      output: '  node-fake-path/foo\n'
    });

    process.env.NODE_PATH = 'node-fake-path/foo';
    assert(!rule.verify());
  });

  it('pass if NODE_PATH is undefined', function () {
    delete process.env.NODE_PATH;
    assert(!rule.verify());
  });

  it('fail if the npm call throw', function () {
    process.env.NODE_PATH = 'some-path';
    this.sandbox.stub(shell, 'exec').returns({ code: 1 });

    var output = rule.verify();
    assert.equal(output, rule.errors.npmFailure());
  });

  it('fail if the paths mismatch', function () {
    this.sandbox.stub(shell, 'exec').returns({
      code: 0,
      output: 'node-fake-path/foo'
    });

    process.env.NODE_PATH = 'node-fake-path/bar';

    var output = rule.verify();
    assert.equal(output, rule.errors.pathMismatch('node-fake-path/foo'));
  });
});
