'use strict';
const fs = require('fs');
const assert = require('assert');
const sinon = require('sinon');
const rule = require('../lib/rules/bowerrc-home.js');

describe('global .bowerrc rule', () => {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('pass if there is no .bowerrc file in user home', async function () {
    const mock = this.sandbox.mock(fs);
    mock.expects('existsSync').once().withArgs(rule.bowerrcPath).returns(false);
    const error = await rule.verify();
    assert(!error);
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
