import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import os from 'node:os';
import getMessage from '../message.js';

const rule = {
  description: 'No .yo-rc.json file in home directory',
  errors: {
    fileExists() {
      const rm = process.platform === 'win32' ? 'del' : 'rm';
      return getMessage('yo-rc-home-file-exists', {
        yorc: '.yo-rc.json',
        command: rm + ' ~/.yo-rc.json',
      });
    },
  },
  yorcPath: path.join(os.homedir(), '.yo-rc.json'),
  async verify() {
    const exists = fs.existsSync(this.yorcPath);
    return exists ? this.errors.fileExists() : null;
  },
};

export default rule;
