'use strict';
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var Twig = require('twig');
require('chalk-twig-filters')(Twig, chalk);

exports.get = function (message, data) {
    var fileTemplate = fs.readFileSync(path.join(__dirname, '/messages', message + '.twig'), 'utf8');
    return Twig.twig({data: fileTemplate}).render(data);
};
