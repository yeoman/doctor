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

  it('pass if there is no .yo-rc.json file in user home', function (done) {
    const mock = this.sandbox.mock(fs);
    mock.expects('exists').once().withArgs(rule.yorcPath).yields(false);
    rule.verify(error => {
      assert(!error);
      mock.verify();
      done();
    });
  });

  it('fail if there is a .yo-rc.json file in user home', function (done) {
    const mock = this.sandbox.mock(fs);
    mock.expects('exists').once().withArgs(rule.yorcPath).yields(true);
    rule.verify(error => {
      assert.equal(error, rule.errors.fileExists());
      mock.verify();
      done();
    });
  });
});
