'use strict';
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Twig = require('twig');

// Add Chalk to Twig
for (const style of Object.keys(chalk.styles)) {
  Twig.extendFilter(style, input => chalk[style](input));
}

exports.get = (message, data) => {
  const fileTemplate = fs.readFileSync(path.join(__dirname, 'messages', `${message}.twig`), 'utf8');
  return Twig.twig({data: fileTemplate}).render(data);
};
