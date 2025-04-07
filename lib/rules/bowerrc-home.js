'use strict';
const fs = require('fs');
const path = require('path');
const process = require('process');
const os = require('os');
const message = require('../message.js');

exports.description = 'No .bowerrc file in home directory';

const errors = {
  fileExists() {
    const rm = process.platform === 'win32' ? 'del' : 'rm';
    return message.get('bowerrc-home-file-exists', {
      bowerrc: '.bowerrc',
      command: rm + ' ~/.bowerrc',
    });
  },
};
exports.errors = errors;

exports.bowerrcPath = path.join(os.homedir(), '.bowerrc');

exports.verify = async () => {
  const exists = fs.existsSync(this.bowerrcPath);
  return exists ? errors.fileExists() : null;
};
