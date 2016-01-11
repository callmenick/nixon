/* =============================================================================
    Name: yo.js
    Description: Yo bot module. Say yo, and it'll say yo back.
    Author: Nick Salloum
    License: MIT
============================================================================= */

/**
 * @name yo
 */
function yo(bot) {

  bot.listen(/yo/, response => {
    const message = {
      text: 'yo back!'
    };

    response.send(message, reply => {
      console.log(reply);
    });
  });

  bot.listen(/attach/, response => {
    const message = {
      text: 'Attach',
      attachments: [
        {
          'color': '#28aadc',
          'text': 'This is attachment text #1!'
        },
        {
          'color': '#f70593',
          'text': 'This is attachment text #2!'
        },
        {
          'color': '#9ff705',
          'text': 'This is attachment text #3!'
        }
      ]
    };

    response.send(message);
  });
}

module.exports = yo;
