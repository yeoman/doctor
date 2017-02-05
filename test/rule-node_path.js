/* eslint-disable unicorn/filename-case */
'use strict';
var assert = require('assert');
var path = require('path');
var childProcess = require('child_process');
var sinon = require('sinon');
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

  it('pass if npm root is contained in NODE_PATH', function (done) {
    this.sandbox.stub(childProcess, 'exec').yields(null, '  node-fake-path/foo\n');

    process.env.NODE_PATH = 'node-fake-path/foo';
    rule.verify(function (error) {
      assert(!error);
      done();
    });
  });

  it('pass if NODE_PATH is undefined', function (done) {
    delete process.env.NODE_PATH;
    rule.verify(function (error) {
      assert(!error);
      done();
    });
  });

  it('fail if the npm call throw', function (done) {
    process.env.NODE_PATH = 'some-path';
    this.sandbox.stub(childProcess, 'exec').yields(new Error());

    rule.verify(function (error) {
      assert.equal(error, rule.errors.npmFailure());
      done();
    });
  });

  it('fail if the paths mismatch', function (done) {
    this.sandbox.stub(childProcess, 'exec').yields(null, 'node-fake-path/foo');

    process.env.NODE_PATH = 'node-fake-path/bar';

    rule.verify(function (error) {
      assert.equal(error, rule.errors.pathMismatch(path.resolve('node-fake-path/foo')));
      done();
    });
  });
});
