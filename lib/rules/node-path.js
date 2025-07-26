import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import childProcess from 'node:child_process';
import getMessage from '../message.js';

function fixPath(filepath) {
  let fixedPath = path.resolve(path.normalize(filepath.trim()));

  try {
    fixedPath = fs.realpathSync(fixedPath);
  } catch (error) {
    if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') {
      throw error;
    }
  }

  return fixedPath;
}

const rule = {
  description: 'NODE_PATH matches the npm root',
  errors: {
    npmFailure() {
      return getMessage('node-path-npm-failure', {});
    },
    pathMismatch(npmRoot) {
      let messagePath = 'node-path-path-mismatch';

      if (process.platform === 'win32') {
        messagePath += '-windows';
      }

      return getMessage(messagePath, {
        path: process.env.NODE_PATH,
        npmroot: npmRoot,
      });
    },
  },
  async verify() {
    if (process.env.NODE_PATH === undefined) {
      return null;
    }

    const nodePaths = (process.env.NODE_PATH || '').split(path.delimiter).map(segment => fixPath(segment));

    try {
      const stdout = childProcess.execSync('npm -g root --silent');
      const npmRoot = fixPath(stdout);

      if (!nodePaths.includes(npmRoot)) {
        return this.errors.pathMismatch(npmRoot);
      }

      return null;
    } catch {
      return this.errors.npmFailure();
    }
  },
};

export default rule;
