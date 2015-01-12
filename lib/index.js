'use strict';
var chalk = require('chalk');
var requireall = require('require-dir');
var _ = require('lodash');
var async = require('async');
var symbols = require('log-symbols');
var align = require('./utils/align');

module.exports = {
  rules: requireall('./rules'),

  run: function () {
    this.errorCount = 0;
    console.log(chalk.underline.blue('[Yeoman Doctor] Running sanity checks on your system\n'));
    async.map(_.values(this.rules), this.processRule.bind(this), this.onEnd.bind(this));
  },

  processRule: function (rule, cb) {
    rule.verify(function (error) {
      this.logResult(rule.description, error);
      cb();
    }.bind(this));
  },

  onEnd: function (err) {
    if (this.errorCount === 0) {
      console.log(chalk.green('\n[Diagnosis] Everything looks all right!'));
    } else {
      console.log(chalk.red('\n[Diagnosis] Uh oh, I found potential issues on your machine'));
    }
  },

  logResult: function (description, error) {
    console.log(align({
      left: description,
      right: error ? symbols.error : symbols.success
    }));

    if (error) {
      this.errorCount++;
      console.log(error);
    }
  }
};
