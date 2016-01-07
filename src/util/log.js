/* =============================================================================
    Name: log.js
    Description: A simple logger
    Author: Nick Salloum
    License: MIT
============================================================================= */

const chalk = require('chalk');
const dateFormat = require('dateformat');

/**
 * @name getTime
 * @description [description]
 * @return {[type]} [description]
 */
function getTime() {
  const now = new Date();
  return dateFormat(now, 'yyyy-mm-dd hh:MM:ss');
}

/**
 * @name log
 * @description [description]
 * @param {[type]} type [description]
 * @param {[type]} message [description]
 * @return {[type]} [description]
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
