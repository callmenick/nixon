/* =============================================================================
    Name: scheduler.js
    Description: Scheduler bot module.
    Author: Nick Salloum
    License: MIT
============================================================================= */

var CronJob = require('cron').CronJob;

/**
 * @name scheduler
 * @description [description]
 * @param {[type]} ferd [description]
 * @return {[type]} [description]
 */
function scheduler(bot) {

  bot.listen(/yo/, (respond) => {
    job(respond);
  });

}

/**
 * [job description]
 * @return {[type]} [description]
 */
function job(respond) {
  new CronJob({
    cronTime: '*/5 * * * * *',
    start: true,
    onTick: () => {
      respond('You will see this message every 5 seconds');
    },
    onComplete: () => {
      console.log('done...');
    }
  });
}

module.exports = scheduler;
