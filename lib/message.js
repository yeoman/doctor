'use strict';

var fs = require('fs');
var chalk = require('chalk');
var Twig = require('twig');
var path = require('path');
require('chalk-twig-filters')(Twig, chalk);

exports.get = function(message, data) {

    var fileTemplate = fs.readFileSync(path.join(__dirname, '/messages', message + '.twig'), 'utf8');
    var msgTemplate = Twig.twig({ data : fileTemplate });

    return msgTemplate.render(data);
};