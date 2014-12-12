'use strict';

var fs = require('fs');
var chalk = require('chalk');
var Twig = require('twig');
require('chalk-twig-filters')(Twig, chalk);

var getmessage = module.exports.get = function(message, data) {
    var fileTemplate, msgTemplate;

    fileTemplate = fs.readFileSync(__dirname + '/messages/' + message, 'utf8');
    if (!fileTemplate) {
        throw new Error('Message template not found!');
    }

    msgTemplate = Twig.twig({ data : fileTemplate });

    return msgTemplate.render(data);
};