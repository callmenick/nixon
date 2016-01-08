/* =============================================================================
    Name: scheduler.js
    Description: Scheduler bot module.
    Author: Nick Salloum
    License: MIT
============================================================================= */

/**
 * @name scheduler
 */
function scheduler(bot) {

  bot.listen(/schedule/, response => {
    response.send('Time to create a schedule!');
  });

}

module.exports = scheduler;
