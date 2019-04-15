'use strict';
const fs = require('fs');
const assert = require('assert');
const sinon = require('sinon');
const rule = require('../lib/rules/yo-rc-home');

describe('global .yo-rc.json rule', () => {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('pass if there is no .yo-rc.json file in user home', async function () {
    const mock = this.sandbox.mock(fs);
    mock.expects('existsSync').once().withArgs(rule.yorcPath).returns(false);
    const error = await rule.verify();
    assert(!error);
    mock.verify();
  });

  it('fail if there is a .yo-rc.json file in user home', async function () {
    const mock = this.sandbox.mock(fs);
    mock.expects('existsSync').once().withArgs(rule.yorcPath).returns(true);
    const error = await rule.verify();
    assert.equal(error, rule.errors.fileExists());
    mock.verify();
  });
});
