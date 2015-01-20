'use strict';
var chalk = require('chalk');
var requireall = require('require-dir');
var objectValues = require('object-values');
var async = require('async');
var symbols = require('log-symbols');

module.exports = {
  rules: requireall('./rules'),

  run: function () {
    this.errorCount = 0;
    console.log('\n' + chalk.underline.blue('Yeoman Doctor'));
    console.log('Running sanity checks on your system\n');
    async.map(objectValues(this.rules), this.processRule.bind(this), this.onEnd.bind(this));
  },

  processRule: function (rule, cb) {
    rule.verify(function (error) {
      this.logResult(rule.description, error);
      cb();
    }.bind(this));
  },

  onEnd: function (err) {
    if (this.errorCount === 0) {
      console.log(chalk.green('\nEverything looks all right!'));
    } else {
      console.log(chalk.red('\nFound potential issues on your machine :('));
    }
  },

  logResult: function (description, error) {
    console.log(error ? symbols.error : symbols.success + ' ' + description);

    if (error) {
      this.errorCount++;
      console.log(error);
    }
  }
};
