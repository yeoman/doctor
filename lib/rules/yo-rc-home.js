'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf;
var userHome = require('user-home');

exports.description = 'No .yo-rc.json file in home directory';

var errors = exports.errors = {
  fileExists: function () {
    var message = [
      '',
      'We found a %1$s file in your home directory. Delete it or Yeoman will',
      'generate everything in your home rather then your project folder.',
      '',
      'To delete the file, run: %2$s',
      ''
    ].join('\n');
    var rm = (process.platform === 'win32') ? 'del' : 'rm';

    return sprintf(message, chalk.cyan('.yo-rc.json'), chalk.magenta(rm + ' ~/.yo-rc.json'));
  }
};

exports.yorcPath = path.join(userHome, '.yo-rc.json');
exports.verify = function () {
  if (fs.existsSync(this.yorcPath)) {
    return errors.fileExists();
  }
};
