import latestVersion from 'latest-version';
import binaryVersionCheck from 'binary-version-check';
import getMessage from '../message.js';

const rule = {
  latestVersion,
  description: 'environment version',
  errors: {
    oldEnvironmentVersion() {
      return getMessage('environment-version-out-of-date', {});
    },
  },
  async verify() {
    try {
      const version = await this.latestVersion('yeoman-environment');
      // Pass --help to avoid old yo versions trying to run a generator.
      const result = await binaryVersionCheck('yo', `>=${version}`, {args: ['--help', '--environment-version']});
      return result;
    } catch (error) {
      if (error.name === 'InvalidBinaryVersion') {
        return this.errors.oldEnvironmentVersion();
      }

      console.log(error);
      return error;
    }
  },
};

export default rule;
