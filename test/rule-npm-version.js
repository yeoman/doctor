import assert from 'node:assert';
import rule from '../lib/rules/npm-version.js';

describe('npm version', () => {
  it('pass if it\'s new enough', async () => {
    rule.OLDEST_NPM_VERSION = 'v1.0.0';

    const error = await rule.verify();
    assert.ok(!error, error);
  });

  it('fail if it\'s too old', async () => {
    rule.OLDEST_NPM_VERSION = 'v100.0.0';

    const error = await rule.verify();
    assert.ok(error, error);
  });
});
