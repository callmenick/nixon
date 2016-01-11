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
function log(type, ...messages) {
  switch (type) {
    case 'success':
      console.log.call(console, chalk.green('Success:'), chalk.gray(getTime()), ...messages);
      break;
    case 'error':
      console.log.call(console, chalk.red('Error:'), chalk.gray(getTime()), ...messages);
      break;
    case 'warn':
      console.log.call(console, chalk.yellow('Warning:'), chalk.gray(getTime()), ...messages);
      break;
    case 'info':
      console.log.call(console, chalk.blue('Info:'), chalk.gray(getTime()), ...messages);
      break;
    default:
      console.log.call(console, chalk.blue('Info:'), chalk.gray(getTime()), ...messages);
  }
}

module.exports = log;
