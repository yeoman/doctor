'use strict';
var latestVersion = require('latest-version');
var binVersionCheck = require('bin-version-check');
var message = require('../message');

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
    binVersionCheck('yo', '>=' + version)
      .then(cb, () => cb(errors.oldYoVersion()));
  });
};
