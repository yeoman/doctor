'use strict';

var path = require('path');
var chalk = require('chalk');
var shell = require('shelljs');

exports.description = 'NODE_PATH match the npm root';

var errors = exports.errors = {
  npmFailure: function () {
    return [
      chalk.red('Unable to find the npm root, something went wrong.'),
      'Try to execute ' + chalk.magenta('npm -g root --silent') + ' on your command line'
    ].join('\n');
  },

  pathMismatch: function (npmRoot) {
    var output = '';
    output += 'npm root value is not in your NODE_PATH\n';
    output += '  [' + chalk.cyan('info') + ']\n';
    output += [
    '    NODE_PATH = ' + process.env.NODE_PATH,
    '    npm root  = ' + npmRoot
    ].join('\n');
    output += '\n\n  [' + chalk.cyan('Fix') + '] Append the npm root value to your NODE_PATH variable\n';

    if (process.platform === 'win32') {
      output += [
      '    If you\'re using cmd.exe, run this command to fix the issue:',
      '      setx NODE_PATH "%NODE_PATH%;' + npmRoot + '"',
      '    Then restart your command line. Otherwise, you can setup NODE_PATH manually:',
      '      https://github.com/sindresorhus/guides/blob/master/set-environment-variables.md#windows'
      ].join('\n');
    } else {
      output += [
      '    Add this line to your .bashrc',
      '      export NODE_PATH=$NODE_PATH:' + npmRoot,
      '    Or run this command',
      '      echo "export NODE_PATH=$NODE_PATH:' + npmRoot + '" >> ~/.bashrc && source ~/.bashrc'
      ].join('\n');
    }

    return output;
  }
};

exports.verify = function () {
  if (process.env.NODE_PATH == null) return;

  var nodePaths = process.env.NODE_PATH.split(path.delimiter).map(path.normalize);
  var npmCmd = shell.exec('npm -g root --silent', { silent: true });
  var exitcode = npmCmd.code;

  if (exitcode !== 0) {
    return errors.npmFailure();
  }

  var npmRoot = npmCmd.output;

  npmRoot = path.normalize(npmRoot.trim());

  if (nodePaths.indexOf(npmRoot) < 0) {
    return errors.pathMismatch(npmRoot);
  }
};
