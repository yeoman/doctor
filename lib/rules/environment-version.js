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
    oldYoVersion() {
      return getMessage('yo-version-out-of-date', {});
    },
  },
  async verify() {
    try {
      await binaryVersionCheck('yo', '>=6.0.0');
    } catch (error) {
      if (error.name === 'InvalidBinaryVersion') {
        return this.errors.oldYoVersion();
      }

      console.log(error);
      return error;
    }

    try {
      const version = await this.latestVersion('yeoman-environment');
      await binaryVersionCheck('yo', `>=${version}`, {args: ['--environment-version']});
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
