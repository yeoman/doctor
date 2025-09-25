import latestVersion from 'latest-version';
import binaryVersionCheck from 'binary-version-check';
import getMessage from '../message.js';

const rule = {
  description: 'yo version',
  errors: {
    oldYoVersion() {
      return getMessage('yo-version-out-of-date', {});
    },
  },
  async verify() {
    try {
      const version = await latestVersion('yo');
      await binaryVersionCheck('yo', `>=${version}`);
    } catch (error) {
      if (error.name === 'InvalidBinaryVersion') {
        return this.errors.oldYoVersion();
      }

      console.log(error);
      return error;
    }
  },
};

export default rule;
