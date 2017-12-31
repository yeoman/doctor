'use strict';
const assert = require('assert');
const rule = require('../lib/rules/npm-version');

describe('npm version', () => {
  it('pass if it\'s new enough', cb => {
    rule.OLDEST_NPM_VERSION = 'v1.0.0';

    rule.verify(err => {
      assert(!err, err);
      cb();
    });
  });

  it('fail if it\'s too old', cb => {
    rule.OLDEST_NPM_VERSION = 'v100.0.0';

    rule.verify(err => {
      assert(err, err);
      cb();
    });
  });
});
