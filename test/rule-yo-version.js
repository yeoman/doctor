'use strict';
var assert = require('assert');
var proxyquire = require('proxyquire');

describe('yo version', function () {
  var latestVersion = {
    catch: function () {
      return latestVersion;
    }
  };
  var rule = proxyquire('../lib/rules/yo-version', {
    'latest-version': function () {
      return latestVersion;
    }
  });

  it('pass if it\'s new enough', function (cb) {
    latestVersion.then = function (callback) {
      callback('1.8.4');
    };

    rule.verify(function (err) {
      assert(!err, err);
      cb();
    });
  });

  it('fail if it\'s too old', function (cb) {
    latestVersion.then = function (callback) {
      callback('999.999.999');
    };

    rule.verify(function (err) {
      assert(err, err);
      cb();
    });
  });
});
