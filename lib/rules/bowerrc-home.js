'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var userHome = require('user-home');

exports.description = 'No .bowerrc file in home directory';

var errors = exports.errors = {
  fileExists: function () {
    var output = [
      'We found a ' + chalk.cyan('.bowerrc') + ' file in your home directory. This can cause',
      'issue by overriding default expected parameters. Prefer setting up one .bowerrc per',
      'project. To delete the file, run:',
    ];

    if (process.platform === 'win32') {
      output.push(chalk.magenta('  del ~/.bowerrc'));
    } else {
      output.push(chalk.magenta('  rm ~/.bowerrc'));
    }

    return output.join('\n');
  }
};

exports.bowerrcPath = path.join(userHome, '.bowerrc');
exports.verify = function () {
  if (fs.existsSync(this.bowerrcPath)) {
    return errors.fileExists();
  }
};
