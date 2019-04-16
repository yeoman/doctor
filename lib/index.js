'use strict';
const chalk = require('chalk');
const symbols = require('log-symbols');
const rules = require('./rules');

module.exports = function () {
  let errCount = 0;

  console.log('\n' + chalk.underline.blue('Yeoman Doctor'));
  console.log('Running sanity checks on your system\n');

  (async () => {
    await Promise.all(
      Object.values(rules).map(rule => {
        return rule.verify().then(error => {
          console.log((error ? symbols.error : symbols.success) + ' ' + rule.description);

          if (error) {
            errCount++;
            console.log(error);
          }
        });
      })
    );

    if (errCount === 0) {
      console.log(chalk.green('\nEverything looks all right!'));
    } else {
      console.log(chalk.red('\nFound potential issues on your machine :('));
    }
  })();
};
