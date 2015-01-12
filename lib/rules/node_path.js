'use strict';
var path = require('path');
var child_process = require('child_process')
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

exports.verify = function (cb) {
  if (process.env.NODE_PATH == null) {
    return cb(null);
  }

  var nodePaths = (process.env.NODE_PATH || '').split(path.delimiter).map(fixPath);
  child_process.exec('npm -g root --silent', function(err, stdout, stderr) {
    if (err) {
      return cb(errors.npmFailure());
    }

    var npmRoot = fixPath(stdout);

    if (nodePaths.indexOf(npmRoot) < 0) {
      return cb(errors.pathMismatch(npmRoot));
    }

    cb(null);
  });
};
