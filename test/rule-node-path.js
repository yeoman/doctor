'use strict';
const assert = require('assert');
const path = require('path');
const childProcess = require('child_process');
const process = require('process');
const sinon = require('sinon');
const rule = require('../lib/rules/node-path.js');

describe('NODE_PATH rule', () => {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
    this.beforePath = process.env.NODE_PATH;
  });

  afterEach(function () {
    this.sandbox.restore();
    process.env.NODE_PATH = this.beforePath;
  });

  it('pass if npm root is contained in NODE_PATH', async function () {
    this.sandbox.stub(childProcess, 'execSync').returns('node-fake-path/foo\n');
    process.env.NODE_PATH = 'node-fake-path/foo';
    const error = await rule.verify();
    assert(!error);
  });

  it('pass if NODE_PATH is undefined', async () => {
    delete process.env.NODE_PATH;
    const error = await rule.verify();
    assert(!error);
  });

  it('fail if the npm call throw', async function () {
    this.sandbox.stub(childProcess, 'execSync').returns(new Error('Child Process failure'));
    process.env.NODE_PATH = 'some-path';
    const error = await rule.verify();
    assert.equal(error, rule.errors.npmFailure());
  });

  it('fail if the paths mismatch', async function () {
    this.sandbox.stub(childProcess, 'execSync').returns('node-fake-path/foo');
    process.env.NODE_PATH = 'node-fake-path/bar';
    const error = await rule.verify();
    assert.equal(error, rule.errors.pathMismatch(path.resolve('node-fake-path/foo')));
  });
});
