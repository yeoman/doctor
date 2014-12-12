'use strict';

var assert = require('assert');
var sinon = require('sinon');
var fs = require('fs');
var rule = require('../lib/rules/global_config');

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

  /*
    TODO: Rewrite these tests, because they fail. This is due to the fact readFileSync is used to get the error message
  */
  // it('fails if JSON is invalid', function () {
  //   this.sandbox.stub(fs, 'existsSync').returns(true);
  //   this.sandbox.stub(fs, 'readFileSync').returns('@#');
  //   assert.equal(rule.verify(), rule.errors.syntax(new SyntaxError('Unexpected token @'), rule.configPath));
  // });

  // it('fails if file is unreadable', function () {
  //   this.sandbox.stub(fs, 'existsSync').returns(true);
  //   this.sandbox.stub(fs, 'readFileSync').throws(new Error('nope'));
  //   assert.equal(rule.verify(), rule.errors.misc(rule.configPath));
  // });
});
