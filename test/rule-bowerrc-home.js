import fs from 'node:fs';
import assert from 'node:assert';
import sinon from 'sinon';
import rule from '../lib/rules/bowerrc-home.js';

describe('global .bowerrc rule', () => {
  beforeEach(function () {
    this.sandbox = sinon.createSandbox();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('pass if there is no .bowerrc file in user home', async function () {
    const mock = this.sandbox.mock(fs);
    mock.expects('existsSync').once().withArgs(rule.bowerrcPath).returns(false);
    const error = await rule.verify();
    assert.ok(!error);
    mock.verify();
  });

  it('fail if there is a .bowerrc file in user home', async function () {
    const mock = this.sandbox.mock(fs);
    mock.expects('existsSync').once().withArgs(rule.bowerrcPath).returns(true);
    const error = await rule.verify();
    assert.equal(error, rule.errors.fileExists());
    mock.verify();
  });
});
