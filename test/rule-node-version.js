'use strict';
const assert = require('assert');
const rule = require('../lib/rules/node-version');

let _processVersion;

before(() => {
  _processVersion = process.version;
  Object.defineProperty(process, 'version', {writable: true});
});

after(() => {
  process.version = _processVersion;
});

describe('Node.js version', () => {
  it('pass if it\'s new enough', cb => {
    process.version = 'v100.0.0';

    rule.verify(err => {
      assert(!err, err);
      cb();
    });
  });

  it('fail if it\'s too old', cb => {
    process.version = 'v0.10.0';

    rule.verify(err => {
      assert(err, err);
      cb();
    });
  });
});
