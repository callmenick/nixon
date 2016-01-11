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
    const message = {
      text: 'Time to create a schedule!'
    };

    response.send(message);
  });

}

module.exports = scheduler;
