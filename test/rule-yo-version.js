'use strict';
const assert = require('assert');
const proxyquire = require('proxyquire');

describe('yo version', () => {
  const latestVersion = {
    catch() {
      return latestVersion;
    }
  };
  const rule = proxyquire('../lib/rules/yo-version', {
    'latest-version'() {
      return latestVersion;
    }
  });

  it('pass if it\'s new enough', async () => {
    latestVersion.then = callback => {
      callback('1.8.4');
    };

    const error = await rule.verify();
    assert(!error, error);
  });

  it('fail if it\'s too old', async () => {
    latestVersion.then = callback => {
      callback('999.999.999');
    };

    const error = await rule.verify();
    assert(error, error);
  });
});
