'use strict';

var fs = require('fs');
var path = require('path');
var userHome = require('user-home');
var message = require('../message');

exports.description = 'No .yo-rc.json file in home directory';

var errors = exports.errors = {
  fileExists: function () {
    var rm = (process.platform === 'win32') ? 'del' : 'rm';
    return message.get('yo-rc-home-file-exists', {
      bowerrc : '.yo-rc.json',
      command : rm + ' ~/.yo-rc.json'
    });
  }
};

exports.yorcPath = path.join(userHome, '.yo-rc.json');
exports.verify = function () {
  if (fs.existsSync(this.yorcPath)) {
    return errors.fileExists();
  }
};
