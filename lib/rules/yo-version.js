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

exports.verify = async () => {
  try {
    const version = await latestVersion('yo');
    const result = await binVersionCheck('yo', `>=${version}`);
    return result;
  } catch (error) {
    if (error.name === 'InvalidBinVersion') {
      return errors.oldYoVersion();
    }

    console.log(error);
    return error;
  }
};
