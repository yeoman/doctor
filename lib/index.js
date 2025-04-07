'use strict';
const chalk = require('chalk');
const symbols = require('log-symbols');
const rules = require('./rules/index.js');

function doctor() {
  let errorCount = 0;

  console.log('\n' + chalk.underline.blue('Yeoman Doctor'));
  console.log('Running sanity checks on your system\n');

  (async () => {
    await Promise.all(
      Object.values(rules).map(rule =>
        rule.verify().then(error => {
          console.log(
            (error ? symbols.error : symbols.success) + ' ' + rule.description,
          );

          if (error) {
            errorCount++;
            console.log(error);
          }
        }),
      ),
    );

    if (errorCount === 0) {
      console.log(chalk.green('\nEverything looks all right!'));
    } else {
      console.log(chalk.red('\nFound potential issues on your machine :('));
    }
  })();
}

module.exports = doctor;
