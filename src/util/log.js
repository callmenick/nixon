/* =============================================================================
    Name: log.js
    Description: A simple logger
    Author: Nick Salloum
    License: MIT
============================================================================= */

const chalk = require('chalk');
const dateFormat = require('dateformat');

/** @namespace log */

/**
 * @name getTime
 * @memberOf log
 * @description Gets the current time and formats it.
 */
function getTime() {
  const now = new Date();
  return dateFormat(now, 'yyyy-mm-dd hh:MM:ss');
}

/**
 * @name log
 * @memberOf log
 * @description Prints a formatted message to the console.
 */
function log(type, message) {
  switch (type) {
    case 'success':
      console.log(chalk.green('Success:'), chalk.gray(getTime()), message);
      break;
    case 'error':
      console.log(chalk.red('Error:'), chalk.gray(getTime()), message);
      break;
    case 'warn':
      console.log(chalk.yellow('Warning:'), chalk.gray(getTime()), message);
      break;
    case 'info':
      console.log(chalk.blue('Info:'), chalk.gray(getTime()), message);
      break;
    default:
      console.log(chalk.blue('Info:'), chalk.gray(getTime()), message);
  }
}

module.exports = log;
