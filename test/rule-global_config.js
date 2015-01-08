'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var rule = require('../lib/rules/global_config');

// Setting the message paths & files before fs is stubbed
var messageSyntaxPath = path.join(__dirname, '../lib/messages', 'global-config-syntax.twig');
var messageSyntaxFile = fs.readFileSync(messageSyntaxPath, 'utf8');
var messageMiscPath = path.join(__dirname, '../lib/messages', 'global-config-misc.twig');
var messageMiscFile = fs.readFileSync(messageMiscPath, 'utf8');

describe('global config rule', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('pass if there is no global config', function () {
    this.sandbox.stub(fs, 'existsSync').returns(false);
    assert(!rule.verify());
  });

  it('pass if the config content is valid JSON', function () {
    this.sandbox.stub(fs, 'existsSync').returns(true);
    this.sandbox.stub(fs, 'readFileSync').returns('{ "foo": 1 }');
    assert(!rule.verify());
  });

  it('fails if JSON is invalid', function () {
    this.sandbox.stub(fs, 'existsSync').withArgs(rule.configPath).returns(true);

    var fsStub = this.sandbox.stub(fs, 'readFileSync');
    fsStub.withArgs(rule.configPath).returns('@#');
    fsStub.withArgs(messageSyntaxPath).returns(messageSyntaxFile);

    assert.equal(rule.verify(), rule.errors.syntax(new SyntaxError('Unexpected token @'), rule.configPath));
  });

  it('fails if file is unreadable', function () {
    this.sandbox.stub(fs, 'existsSync').withArgs(rule.configPath).returns(true);

    var fsStub = this.sandbox.stub(fs, 'readFileSync');
    fsStub.withArgs(rule.configPath).throws(new Error('nope'));
    fsStub.withArgs(messageMiscPath).returns(messageMiscFile);

    assert.equal(rule.verify(), rule.errors.misc(rule.configPath));
  });
});
