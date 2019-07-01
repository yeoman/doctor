#!/usr/bin/env node
'use strict';
require('.')();

// Override http networking to go through a proxy if one is configured.
const MAJOR_NODEJS_VERSION = parseInt(process.version.slice(1).split('.')[0], 10);

if (MAJOR_NODEJS_VERSION >= 10) {
  // `global-agent` works with Node.js v10 and above.
  require('global-agent').bootstrap();
} else {
  // `global-tunnel-ng` works only with Node.js v10 and below.
  require('global-tunnel-ng').initialize();
}
