'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var shell = require('shelljs');
var userHome = require('user-home');
var align = require('./utils/align');
var symbols = require('log-symbols');

function verifyRule(rule) {
  return {
    description: rule.description,
    error: rule.verify()
  };
}

module.exports = {

  rules: [
    require('./rules/node_path'),
    require('./rules/global_config'),
    require('./rules/yo-rc-home'),
    require('./rules/bowerrc-home')
  ],

  run: function () {
    var errors = this.rules.map(verifyRule);
    this.logResults(errors);
  },

  logResults: function (results) {
    var allGood = true;
    console.log(chalk.underline.blue('[Yeoman Doctor] Running sanity checks on your system'));

    results.forEach(function (rule) {
      var passing = !rule.error;
      console.log(align({
        left: rule.description,
        right: passing ? symbols.success : symbols.error
      }));
      if (!passing) {
        allGood = false;
        console.log(rule.error);
        console.log();
      }
    });

    console.log();
    if (allGood) {
      console.log(chalk.green('[Diagnosis] Everything looks all right!'));
    } else {
      console.log(chalk.red('[Diagnosis] Uh oh, I found potential issues on your machine'));
    }
  }
};
