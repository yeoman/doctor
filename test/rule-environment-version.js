
import assert from 'node:assert';
import { esmocha } from 'esmocha';

const { default: binaryVersion } = await esmocha.mock('binary-version', { default: esmocha.fn() });
const { default: latestVersion } = await esmocha.mock('latest-version', { default: esmocha.fn() });

const { default: rule } = await import('../lib/rules/environment-version.js');

describe('environment version', () => {
  beforeEach(() => {
    esmocha.resetAllMocks();
  });

  it('pass if it\'s new enough', async () => {
    // mock installed yo
    binaryVersion.mockResolvedValueOnce('6.0.0');

    // mock latest yeoman-environment
    latestVersion.mockResolvedValueOnce('1.8.4');
    // mock installed yeoman-environment
    binaryVersion.mockResolvedValueOnce('2.0.0');

    const error = await rule.verify();
    assert.ok(!error, error);
  });

  it('fail if it\'s too old', async () => {
    // mock installed yo
    binaryVersion.mockResolvedValueOnce('6.0.0');

    // mock latest yeoman-environment
    latestVersion.mockResolvedValueOnce('999.999.999');
    // mock installed yeoman-environment
    binaryVersion.mockResolvedValueOnce('2.0.0');

    const error = await rule.verify();
    assert.ok(error, error);
  });

  it('fail if it\'s invalid version range', async () => {
    // mock installed yo
    binaryVersion.mockResolvedValueOnce('6.0.0');

    // mock latest yeoman-environment
    latestVersion.mockResolvedValueOnce('-1');
    // mock installed yeoman-environment
    binaryVersion.mockResolvedValueOnce('2.0.0');

    const error = await rule.verify();
    assert.ok(error, error);
  });
});
