'use strict';

var path = require('path');
var chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf;
var shell = require('shelljs');

exports.description = 'NODE_PATH match the npm root';

var errors = exports.errors = {
  npmFailure: function () {
    var message = [
      '',
      chalk.red('Unable to find the npm root, something went wrong.'),
      'Try to execute %1$s on your command line',
      ''
    ].join('\n');

    return sprintf(message, chalk.magenta('npm -g root --silent'));
  },

  pathMismatch: function (npmRoot) {
    var output = '',
        fix = '';
    // %1$s = process.env.NODE_PATH
    // %2$s = npmRoot
    var message = [
      '',
      chalk.red('npm root value is not in your NODE_PATH'),
      '',
      '[' + chalk.cyan('Info') + ']',
      '  NONE_PATH = %1$s',
      '  npm root  = %2$s',
      '',
      '[' + chalk.cyan('Fix') + '] Append the npm root value to your NODE_PATH variable',
      ''
    ].join('\n');

    if (process.platform === 'win32') {
      message += [
      '  If you\'re using cmd.exe, run this command to fix the issue:',
      chalk.magenta('    setx NODE_PATH "%%NODE_PATH%%;%2$s"'),
      '  Then restart your command line. Otherwise, you can setup NODE_PATH manually:',
      chalk.magenta('    https://github.com/sindresorhus/guides/blob/master/set-environment-variables.md#windows'),
      ''
      ].join('\n');
    } else {
      message += [
      '  Add this line to your .bashrc',
      chalk.magenta('    export NODE_PATH=$NODE_PATH: %2$s'),
      '  Or run this command',
      chalk.magenta('    echo "export NODE_PATH=$NODE_PATH:%2$s" >> ~/.bashrc && source ~/.bashrc'),
      ''
      ].join('\n');
    }

    return sprintf(message, process.env.NODE_PATH, npmRoot);
  }
};

function fixPath(filepath) {
  return path.resolve(path.normalize(filepath.trim()));
}

exports.verify = function () {
  if (process.env.NODE_PATH == null) return;

  var nodePaths = process.env.NODE_PATH.split(path.delimiter).map(fixPath);
  var npmCmd = shell.exec('npm -g root --silent', { silent: true });
  var exitcode = npmCmd.code;

  if (exitcode !== 0) {
    return errors.npmFailure();
  }

  var npmRoot = fixPath(npmCmd.output);

  if (nodePaths.indexOf(npmRoot) < 0) {
    return errors.pathMismatch(npmRoot);
  }
};
