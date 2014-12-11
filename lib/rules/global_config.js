'use strict';

var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf;
var userHome = require('user-home');

exports.description = 'Global configuration file is valid';

var errors = exports.errors = {
  syntax: function (err, configPath) {
    var message = [
      '',
      'Your global config file is not a valid JSON.',
      'It contains the following syntax error: \n  %1$s',
      '',
      'Please open %2$s and fix it manually.',
      ''
    ].join('\n');

    return sprintf(message, err.message, chalk.magenta(configPath));
  },

  misc: function (configPath) {
    var message = [
      '',
      'Unable to read %1$s',
      'Make sure your user have the right permissions to read the file. (look %2$s)',
      ''
    ].join('\n');

    return sprintf(message, chalk.magenta(configPath), chalk.magenta('chmod'));
  }
};

exports.configPath = path.join(userHome, '.yo-rc-global.json');
exports.verify = function() {

  if (!fs.existsSync(this.configPath)) return;

  try {
    JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
  } catch (err) {
    if (err instanceof SyntaxError) {
      return errors.syntax(err, this.configPath);
    } else {
      return errors.misc(this.configPath);
    }
  }

}
