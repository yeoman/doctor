import assert from 'node:assert';
import path from 'node:path';
import childProcess from 'node:child_process';
import process from 'node:process';
import sinon from 'sinon';
import rule from '../lib/rules/node-path.js';

describe('NODE_PATH rule', () => {
  beforeEach(function () {
    this.sandbox = sinon.createSandbox();
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
    assert.ok(!error);
  });

  it('pass if NODE_PATH is undefined', async () => {
    delete process.env.NODE_PATH;
    const error = await rule.verify();
    assert.ok(!error);
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
