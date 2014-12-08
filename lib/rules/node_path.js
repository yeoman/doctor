'use strict';

var path = require('path');
var chalk = require('chalk');
var shell = require('shelljs');

exports.description = 'NODE_PATH match the npm root';

exports.verify = function () {
  if (!process.env.NODE_PATH) return;

  var nodePaths = process.env.NODE_PATH.split(path.delimiter).map(path.normalize);
  var npmCmd = shell.exec('npm -g root --silent', { silent: true });
  var exitcode = npmCmd.code;

  if (exitcode !== 0) {
    console.log(chalk.red('[Yeoman Doctor] Impossible to find the npm root, something went wrong.'));
    console.log(chalk.cyan('Try to execute ') + chalk.green('npm -g root --silent') + chalk.cyan(' on your command line'));
    process.exit(exitcode);
  }

  var npmRoot = npmCmd.output;

  npmRoot = path.normalize(npmRoot.trim());

  if (nodePaths.indexOf(npmRoot) < 0) {
    return nodePathMismatch({
      nodePaths: nodePaths,
      npmRoot: npmRoot
    });
  }
};

function nodePathMismatch(val) {
  var output = '';
  output += 'npm root value is not in your NODE_PATH\n';
  output += '  [' + chalk.cyan('info') + ']\n';
  output += [
  '    NODE_PATH = ' + val.nodePaths.join(path.delimiter),
  '    npm root  = ' + val.npmRoot
  ].join('\n');
  output += '\n\n  [' + chalk.cyan('Fix') + '] Append the npm root value to your NODE_PATH variable\n';

  if (process.platform === 'win32') {
    output += [
    '    If you\'re using cmd.exe, run this command to fix the issue:',
    '      setx NODE_PATH "%NODE_PATH%;' + val.npmRoot + '"',
    '    Then restart your command line. Otherwise, you can setup NODE_PATH manually:',
    '      https://github.com/sindresorhus/guides/blob/master/set-environment-variables.md#windows'
    ].join('\n');
  } else {
    output += [
    '    Add this line to your .bashrc',
    '      export NODE_PATH=$NODE_PATH:' + val.npmRoot,
    '    Or run this command',
    '      echo "export NODE_PATH=$NODE_PATH:' + val.npmRoot + '" >> ~/.bashrc && source ~/.bashrc'
    ].join('\n');
  }

  return output;
};
