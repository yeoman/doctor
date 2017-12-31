'use strict';
const fs = require('fs');
const assert = require('assert');
const sinon = require('sinon');
const rule = require('../lib/rules/bowerrc-home');

describe('global .bowerrc rule', () => {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('pass if there is no .bowerrc file in user home', function (done) {
    const mock = this.sandbox.mock(fs);
    mock.expects('exists').once().withArgs(rule.bowerrcPath).yields(false);
    rule.verify(error => {
      assert(!error);
      mock.verify();
      done();
    });
  });

  it('fail if there is a .bowerrc file in user home', function (done) {
    const mock = this.sandbox.mock(fs);
    mock.expects('exists').once().withArgs(rule.bowerrcPath).yields(true);

    rule.verify(error => {
      assert.equal(error, rule.errors.fileExists());
      mock.verify();
      done();
    });
  });
});
