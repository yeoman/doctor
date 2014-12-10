'use strict';
var _ = require('lodash');
var stringLength = require('string-length');

module.exports = function (conf) {
  conf = _.extend({
    left: '',
    right: '',
    sep: '.'
  }, conf);

  var len = (process.stdout.columns || 130) - stringLength(conf.left + conf.right);
  var middle = _.times(len).map(function () { return conf.sep; }).join('');
  return conf.left + middle + conf.right;
};
