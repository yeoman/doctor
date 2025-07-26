/* eslint-disable unicorn/no-thenable */
import assert from 'node:assert';
import proxyquire from 'proxyquire';

describe('yo version', () => {
  let latestVersion = {
    catch() {
      return latestVersion;
    },
  };
  const rule = proxyquire('../lib/rules/yo-version.js', {
    'latest-version'() {
      return latestVersion;
    },
  });

  it('pass if it\'s new enough', async () => {
    latestVersion = {...latestVersion, then: callback => callback('1.8.4')};

    const error = await rule.verify();
    assert.ok(!error, error);
  });

  it('fail if it\'s too old', async () => {
    latestVersion = {...latestVersion, then: callback => callback('999.999.999')};

    const error = await rule.verify();
    assert.ok(error, error);
  });

  it('fail if it\'s invalid version range', async () => {
    latestVersion = {...latestVersion, then: callback => callback('-1')};

    const error = await rule.verify();
    assert.ok(error, error);
  });
});
