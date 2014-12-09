'use strict';
var _ = require('lodash');
var chalk = require('chalk');

module.exports = function (conf) {
  conf = _.extend({
    left: '',
    right: '',
    sep: '.'
  }, conf);

  var len = (process.stdout.columns || 130) - chalk.stripColor(conf.left + conf.right).length;
  var middle = _.times(len).map(function () { return conf.sep; }).join('');
  return conf.left + middle + conf.right;
};
