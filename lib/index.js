'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var shell = require('shelljs');
var userHome = require('user-home');

module.exports = {
  run: function () {
    var errors = [
      require('./rules/node_path'),
      require('./rules/global_config'),
    ].map(function (rule) {
      return rule.verify();
    }).filter(Boolean);
    this.logErrors(errors);
  },

  logErrors: function (errors) {
    if (!errors.length) {
      console.log(chalk.green('[Yeoman Doctor] Everything looks all right!'));
      console.log();
      return;
    }

    console.log(chalk.red('[Yeoman Doctor] Uh oh, I found potential errors on your machine\n---------------\n'));
    errors.forEach(function (errMsg) {
      console.log('[' + chalk.red('Error') + '] ' + errMsg);
      console.log();
    });
  }
};
