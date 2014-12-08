'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var userHome = require('user-home');

exports.description = 'No .yo-rc.json file in home directory';

var errors = exports.errors = {
  fileExists: function () {
    var output = [
      'We found a ' + chalk.cyan('.yo-rc.json') + ' file in your home directory. Delete it or Yeoman will',
      'generate everything in your home rather then your project folder. Run:',
    ];

    if (process.platform === 'win32') {
      output.push(chalk.magenta('  del ~/.yo-rc.json'));
    } else {
      output.push(chalk.magenta('  rm ~/.yo-rc.json'));
    }

    return output.join('\n');
  }
};

exports.yorcPath = path.join(userHome, '.yo-rc.json');
exports.verify = function () {
  if (fs.existsSync(this.yorcPath)) {
    return errors.fileExists();
  }
};
