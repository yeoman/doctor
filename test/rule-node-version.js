'use strict';
var assert = require('assert');
var rule = require('../lib/rules/node-version');
var _processVersion;

before(function () {
  _processVersion = process.version;
  Object.defineProperty(process, 'version', {writable: true});
});

after(function () {
  process.version = _processVersion;
});

describe('Node.js version', function () {
  it('pass if it\'s new enough', function (cb) {
    process.version = 'v100.0.0';

    rule.verify(function (err) {
      assert(!err, err);
      cb();
    });
  });

  it('fail if it\'s too old', function (cb) {
    process.version = 'v0.10.0';

    rule.verify(function (err) {
      assert(err, err);
      cb();
    });
  });
});
