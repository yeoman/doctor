'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf;
var userHome = require('user-home');

exports.description = 'No .bowerrc file in home directory';

var errors = exports.errors = {
  fileExists: function () {
    var message = [
      '',
      'We found a %1$s file in your home directory. This can cause',
      'issue by overriding default expected parameters. Prefer setting up one .bowerrc per',
      'project.',
      '',
      'To delete the file, run: %2$s',
      ''
    ].join('\n');
    var rm = (process.platform === 'win32') ? 'del' : 'rm';

    return sprintf(message, chalk.cyan('.bowerrc'), chalk.magenta(rm + ' ~/.bowerrc'));
  }
};

exports.bowerrcPath = path.join(userHome, '.bowerrc');
exports.verify = function () {
  if (fs.existsSync(this.bowerrcPath)) {
    return errors.fileExists();
  }
};
