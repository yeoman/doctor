'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const rule = require('../lib/rules/global-config');

// Setting the message paths & files before fs is stubbed
const messageSyntaxPath = path.join(__dirname, '../lib/messages', 'global-config-syntax.twig');
const messageSyntaxFile = fs.readFileSync(messageSyntaxPath, 'utf8');
const messageMiscPath = path.join(__dirname, '../lib/messages', 'global-config-misc.twig');
const messageMiscFile = fs.readFileSync(messageMiscPath, 'utf8');

describe('global config rule', () => {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('pass if there is no global config', function (done) {
    this.sandbox.stub(fs, 'existsSync').returns(false);
    rule.verify(error => {
      assert(!error);
      done();
    });
  });

  it('pass if the config content is valid JSON', function (done) {
    this.sandbox.stub(fs, 'existsSync').returns(true);
    this.sandbox.stub(fs, 'readFileSync').returns('{ "foo": 1 }');
    rule.verify(error => {
      assert(!error);
      done();
    });
  });

  it('fails if JSON is invalid', function (done) {
    this.sandbox.stub(fs, 'existsSync').withArgs(rule.configPath).returns(true);

    const fsStub = this.sandbox.stub(fs, 'readFileSync');
    fsStub.withArgs(rule.configPath).returns('@#');
    fsStub.withArgs(messageSyntaxPath).returns(messageSyntaxFile);

    rule.verify(error => {
      // Assert(error instanceof SyntaxError);
      assert(error.includes('Unexpected token @'));
      // Assert.equal(error, rule.errors.syntax(new SyntaxError('Unexpected token @'), rule.configPath));
      done();
    });
  });

  it('fails if file is unreadable', function (done) {
    this.sandbox.stub(fs, 'existsSync').withArgs(rule.configPath).returns(true);

    const fsStub = this.sandbox.stub(fs, 'readFileSync');
    fsStub.withArgs(rule.configPath).throws(new Error('nope'));
    fsStub.withArgs(messageMiscPath).returns(messageMiscFile);

    rule.verify(error => {
      assert.equal(error, rule.errors.misc(rule.configPath));
      done();
    });
  });
});
