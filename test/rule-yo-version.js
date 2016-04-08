'use strict';
var assert = require('assert');
var rule = require('../lib/rules/yo-version');

describe('yo version', function () {
  it('pass if it\'s new enough', function (cb) {
    rule.OLDEST_YO_VERSION = 'v0.0.0';

    rule.verify(function (err) {
      assert(!err, err);
      cb();
    });
  });

  it('fail if it\'s too old', function (cb) {
    rule.OLDEST_YO_VERSION = 'v100.0.0';

    rule.verify(function (err) {
      assert(err, err);
      cb();
    });
  });
});
