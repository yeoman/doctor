'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const message = require('../message');

exports.description = 'No .yo-rc.json file in home directory';

const errors = {
  fileExists() {
    const rm = process.platform === 'win32' ? 'del' : 'rm';
    return message.get('yo-rc-home-file-exists', {
      yorc: '.yo-rc.json',
      command: rm + ' ~/.yo-rc.json'
    });
  }
};
exports.errors = errors;

exports.yorcPath = path.join(os.homedir(), '.yo-rc.json');

exports.verify = async () => {
  const exists = fs.existsSync(this.yorcPath);
  return exists ? errors.fileExists() : null;
};
