
import assert from 'node:assert';
import rule from '../lib/rules/yo-version.js';

describe('yo version', () => {
  it('pass if it\'s new enough', async () => {
    rule.latestVersion = () => Promise.resolve('1.8.4');

    const error = await rule.verify();
    assert.ok(!error, error);
  });

  it('fail if it\'s too old', async () => {
    rule.latestVersion = () => Promise.resolve('999.999.999');

    const error = await rule.verify();
    assert.ok(error, error);
  });

  it('fail if it\'s invalid version range', async () => {
    rule.latestVersion = () => Promise.resolve('-1');

    const error = await rule.verify();
    assert.ok(error, error);
  });
});
