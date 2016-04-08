'use strict';
var message = require('../message');
var latestVersion = require('latest-version');
var binVersionCheck = require('bin-version-check');

exports.description = 'yo version';

var errors = exports.errors = {
  oldYoVersion: function () {
    return message.get('yo-version-out-of-date', {});
  }
};

exports.verify = function (cb) {
  latestVersion('yo').catch(function (err) {
    console.error(err);
    cb(err);
  }).then(function (version) {
    if (typeof exports.OLDEST_YO_VERSION === 'undefined') {
      exports.OLDEST_YO_VERSION = version;
    }
    binVersionCheck('yo', '>=' + exports.OLDEST_YO_VERSION, function (err) {
      cb(err ? errors.oldYoVersion() : null);
    });
  });
};
