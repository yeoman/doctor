'use strict';
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var shell = require('shelljs');
var requireall = require('require-dir');
var _ = require('lodash');
var async = require('async');
var userHome = require('user-home');
var symbols = require('log-symbols');
var align = require('./utils/align');

function verifyRule(rule, cb) {
  var error = rule.verify();
  cb(null, {
    description: rule.description,
    error: error
  });
}

module.exports = {
  rules: requireall('./rules'),

  run: function () {
    var rules = _.values(this.rules);

    async.map(rules, verifyRule, function (err, results) {
      this.logResults(err, results);
    }.bind(this));
  },

  logResults: function (err, results) {
    var allGood = true;
    console.log(chalk.underline.blue('[Yeoman Doctor] Running sanity checks on your system\n'));

    results.forEach(function (rule) {
      var passing = !rule.error;

      console.log(align({
        left: rule.description,
        right: passing ? symbols.success : symbols.error
      }));

      if (!passing) {
        allGood = false;
        console.log(rule.error);
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
