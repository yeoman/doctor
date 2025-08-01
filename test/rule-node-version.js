import assert from 'node:assert';
import process from 'process';
import rule from '../lib/rules/node-version.js';

let _processVersion;

before(() => {
  _processVersion = process.version;
  Object.defineProperty(process, 'version', {writable: true});
});

after(() => {
  process.version = _processVersion;
});

describe('Node.js version', () => {
  it('pass if it\'s new enough', async () => {
    process.version = 'v100.0.0';

    const error = await rule.verify();
    assert.ok(!error, error);
  });

  it('fail if it\'s too old', async () => {
    process.version = 'v0.10.0';

    const error = await rule.verify();
    assert.ok(error, error);
  });
});
