'use strict';
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const message = require('../message');

exports.description = 'NODE_PATH matches the npm root';

const errors = {
  npmFailure() {
    return message.get('node-path-npm-failure', {});
  },

  pathMismatch(npmRoot) {
    let msgPath = 'node-path-path-mismatch';

    if (process.platform === 'win32') {
      msgPath += '-windows';
    }

    return message.get(msgPath, {
      path: process.env.NODE_PATH,
      npmroot: npmRoot
    });
  }
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

  const nodePaths = (process.env.NODE_PATH || '').split(path.delimiter).map(fixPath);

  try {
    const stdout = childProcess.execSync('npm -g root --silent');
    const npmRoot = fixPath(stdout);

    if (nodePaths.indexOf(npmRoot) < 0) {
      return errors.pathMismatch(npmRoot);
    }

    return null;
  } catch (error) {
    return errors.npmFailure();
  }
};
