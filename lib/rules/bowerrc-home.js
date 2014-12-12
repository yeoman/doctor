'use strict';

var fs = require('fs');
var path = require('path');
var userHome = require('user-home');
var Message = require('../message');

exports.description = 'No .bowerrc file in home directory';

var errors = exports.errors = {
  fileExists: function () {
    var rm = (process.platform === 'win32') ? 'del' : 'rm';
    return Message.get('bowerrc-home-file-exists', {
      bowerrc : '.bowerrc',
      command : rm + ' ~/.bowerrc'
    });
  }
};

exports.bowerrcPath = path.join(userHome, '.bowerrc');
exports.verify = function () {
  if (fs.existsSync(this.bowerrcPath)) {
    return errors.fileExists();
  }
};
