
import assert from 'node:assert';
import {esmocha} from 'esmocha';

const {default: binaryVersion} = await esmocha.mock('binary-version', {default: esmocha.fn()});
const {default: latestVersion} = await esmocha.mock('latest-version', {default: esmocha.fn()});

const {default: rule} = await import('../lib/rules/yo-version.js');

describe('yo version', () => {
  it('pass if it\'s new enough', async () => {
    // Mock installed yo
    binaryVersion.mockResolvedValueOnce('6.0.0');

    // Mock latest yo
    latestVersion.mockResolvedValueOnce('1.8.4');

    const error = await rule.verify();
    assert.ok(!error, error);
  });

  it('fail if it\'s too old', async () => {
    // Mock installed yo
    binaryVersion.mockResolvedValueOnce('6.0.0');

    // Mock latest yo
    latestVersion.mockResolvedValueOnce('999.999.999');

    const error = await rule.verify();
    assert.ok(error, error);
  });

  it('fail if it\'s invalid version range', async () => {
    // Mock installed yo
    binaryVersion.mockResolvedValueOnce('6.0.0');

    // Mock latest yo
    latestVersion.mockResolvedValueOnce('-1');

    const error = await rule.verify();
    assert.ok(error, error);
  });
});
