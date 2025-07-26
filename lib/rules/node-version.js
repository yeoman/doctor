import process from 'node:process';
import semver from 'semver';
import getMessage from '../message.js';

const rule = {
  OLDEST_NODE_VERSION: '4.2.0',
  description: 'Node.js version',
  errors: {
    oldNodeVersion() {
      return getMessage('node-version');
    },
  },
  async verify() {
    return semver.lt(process.version, this.OLDEST_NODE_VERSION) ? this.errors.oldNodeVersion() : null;
  },
};

export default rule;
