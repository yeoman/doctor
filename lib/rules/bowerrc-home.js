import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import os from 'node:os';
import getMessage from '../message.js';

const rule = {
  description: 'No .bowerrc file in home directory',
  errors: {
    fileExists() {
      const rm = process.platform === 'win32' ? 'del' : 'rm';
      return getMessage('bowerrc-home-file-exists', {
        bowerrc: '.bowerrc',
        command: rm + ' ~/.bowerrc',
      });
    },
  },
  bowerrcPath: path.join(os.homedir(), '.bowerrc'),
  async verify() {
    const exists = fs.existsSync(this.bowerrcPath);
    return exists ? this.errors.fileExists() : null;
  },
};

export default rule;
