'use strict';
const fs = require('fs');
const path = require('path');
const process = require('process');
const childProcess = require('child_process');
const message = require('../message.js');

exports.description = 'NODE_PATH matches the npm root';

const errors = {
  npmFailure() {
    return message.get('node-path-npm-failure', {});
  },

  pathMismatch(npmRoot) {
    let messagePath = 'node-path-path-mismatch';

    if (process.platform === 'win32') {
      messagePath += '-windows';
    }

    return message.get(messagePath, {
      path: process.env.NODE_PATH,
      npmroot: npmRoot,
    });
  },
};
exports.errors = errors;

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

exports.verify = async () => {
  if (process.env.NODE_PATH === undefined) {
    return null;
  }

  const nodePaths = (process.env.NODE_PATH || '').split(path.delimiter).map(segment => fixPath(segment));

  try {
    const stdout = childProcess.execSync('npm -g root --silent');
    const npmRoot = fixPath(stdout);

    if (!nodePaths.includes(npmRoot)) {
      return errors.pathMismatch(npmRoot);
    }

    return null;
  } catch {
    return errors.npmFailure();
  }
};
