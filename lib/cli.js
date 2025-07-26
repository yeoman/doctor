#!/usr/bin/env node
import globalAgent from 'global-agent';
import app from './index.js';

app();

// Override http networking to go through a proxy if one is configured.
globalAgent.bootstrap();
