import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import getMessage from '../message.js';

const rule = {
  description: 'Global configuration file is valid',
  errors: {
    syntax(error, configPath) {
      return getMessage('global-config-syntax', {
        message: error.message,
        path: configPath,
      });
    },

    misc(configPath) {
      return getMessage('global-config-misc', {
        path: configPath,
      });
    },
  },
  configPath: path.join(os.homedir(), '.yo-rc-global.json'),
  async verify() {
    if (!fs.existsSync(this.configPath)) {
      return null;
    }

    try {
      JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    } catch (error) {
      if (error instanceof SyntaxError) {
        return this.errors.syntax(error, this.configPath);
      }

      return this.errors.misc(this.configPath);
    }

    return null;
  },
};

export default rule;
