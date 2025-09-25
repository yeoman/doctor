import process from 'node:process';
import binaryVersionCheck from 'binary-version-check';
import getMessage from '../message.js';

const rule = {
  OLDEST_NPM_VERSION: '3.3.0',
  description: 'npm version',
  errors: {
    oldNpmVersion() {
      return getMessage('npm-version', {
        isWin: process.platform === 'win32',
      });
    },
  },
  async verify() {
    try {
      await binaryVersionCheck('npm', `>=${this.OLDEST_NPM_VERSION}`);
    } catch {
      return this.errors.oldNpmVersion();
    }
  },
};

export default rule;
