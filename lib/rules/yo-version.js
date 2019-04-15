'use strict';
const latestVersion = require('latest-version');
const binVersionCheck = require('bin-version-check');
const message = require('../message');

exports.description = 'yo version';

const errors = {
  oldYoVersion() {
    return message.get('yo-version-out-of-date', {});
  }
};
exports.errors = errors;

exports.verify = cb => {
  latestVersion('yo').catch(error => {
    console.error(error);
    cb(error);
  }).then(version => {
    binVersionCheck('yo', `>=${version}`)
      .then(cb, () => cb(errors.oldYoVersion()));
  });
};
