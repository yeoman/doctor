#!/usr/bin/env node
'use strict';
require('./index.js')();

// Override http networking to go through a proxy if one is configured.
require('global-agent').bootstrap();
