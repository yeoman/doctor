'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var shell = require('shelljs');
var userHome = require('user-home');

function verifyRule(rule) {
  return {
    description: rule.description,
    error: rule.verify()
  }
}

module.exports = {

  rules: [
    require('./rules/node_path'),
    require('./rules/global_config'),
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
      console.log(rule.description + ' ' + (passing ? chalk.green('OK') : chalk.red('ERROR')));
      if (!passing) {
        allGood = false;
        console.log(rule.error);
      }
    });

    console.log();
    if (allGood) {
      console.log(chalk.green('Everything looks all right!'));
    } else {
      console.log(chalk.red('Uh oh, I found potential errors on your machine'));
    }
  }
};
