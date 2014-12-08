'use strict';

var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var userHome = require('user-home');

exports.description = 'Global configuration file is valid';

var errors = exports.errors = {
  syntax: function (err, configPath) {
    return [
      'Your global config file is not a valid JSON.',
      'It contains the following syntax error: \n  ' + err.message,
      'Please open ' + chalk.magenta(configPath) + ' and fix it manually.'
    ].join('\n');
  },

  misc: function (configPath) {
    return [
      'Unable to read ' + chalk.magenta(configPath),
      'Make sure your user have the right permissions to read the file. (look ' + chalk.magenta('chmod') + ')'
    ].join('\n');
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
