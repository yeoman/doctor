'use strict';
var path = require('path');
var shell = require('shelljs');
var message = require('../message');

exports.description = 'NODE_PATH match the npm root';

var errors = exports.errors = {
  npmFailure: function () {
    return message.get('node-path-npm-failure', {});
  },

  pathMismatch: function (npmRoot) {
    var msgPath = 'node-path-path-mismatch';

    if (process.platform === 'win32') {
      msgPath += '-windows';
    }

    return message.get(msgPath, {
      path: process.env.NODE_PATH,
      npmroot: npmRoot
    });
  }
};

function fixPath(filepath) {
  return path.resolve(path.normalize(filepath.trim()));
}

exports.verify = function () {
  if (process.env.NODE_PATH == null) {
    return;
  }

  var nodePaths = process.env.NODE_PATH.split(path.delimiter).map(fixPath);
  var npmCmd = shell.exec('npm -g root --silent', {silent: true});
  var exitcode = npmCmd.code;

  if (exitcode !== 0) {
    return errors.npmFailure();
  }

  var npmRoot = fixPath(npmCmd.output);

  if (nodePaths.indexOf(npmRoot) < 0) {
    return errors.pathMismatch(npmRoot);
  }
};
