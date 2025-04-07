'use strict';
const process = require('process');
const semver = require('semver');
const message = require('../message.js');

const OLDEST_NODE_VERSION = '4.2.0';

exports.description = 'Node.js version';

const errors = {
  oldNodeVersion() {
    return message.get('node-version');
  },
};
exports.errors = errors;

exports.verify = async () => semver.lt(process.version, OLDEST_NODE_VERSION) ? errors.oldNodeVersion() : null;
