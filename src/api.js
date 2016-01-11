/* =============================================================================
    Name: api.js
    Description: A wrapper around Slack's API.
    Author: Nick Salloum
    License: MIT
============================================================================= */

const request = require('request');

/**
 * @name api
 * @description A wrapper around Slack's API that contains a set of convenience
 *   methods, allowing for quick and easy communication with the API.
 * @return {Object} Collection of convenience methods.
 */
function api() {

  return {
    rtmStart: rtmStart,
    postMessage: postMessage,
    updateMessage: updateMessage,
    deleteMessage: deleteMessage
  };

  /**
   * @name rtmStart
   * @description Starts a Real Time Messaging API session.
   * @param {String} token Token of authenticated user
   * @param {Function} callback
   * @return Nothing
   * @see https://api.slack.com/methods/rtm.start
   */
  function rtmStart(token, callback) {
    apiCall(token, 'rtm.start', null, callback)
      .then(response => {
        callback(response);
      })
      .catch(error => {
        callback(error);
      });
  }

  /**
   * @name postMessage
   * @description Posts a message to a public channel, private group, or IM
   *   channel.
   * @param {String} token Token of authenticated user
   * @param {Message} message The Message
   * @param {Function} callback
   * @return Nothing
   * @see https://api.slack.com/methods/chat.postMessage
   */
  function postMessage(token, message, callback) {
    const qs = {
      text: message.text,
      channel: message.channel,
      attachments: message.attachments,
      as_user: true
    };

    apiCall(token, 'chat.postMessage', qs)
      .then(response => {
        if (callback) { callback(response); }
      })
      .catch(error => {
        if (callback) { callback(error); }
      });
  }

  /**
   * @name updateMessage
   * @description Updates a message in a channel.
   * @param {String} token Token of authenticated user
   * @param {String} ts Message timestamp
   * @param {String} channel Channel
   * @param {String} text Text string
   * @param {Function} callback
   * @return Nothing
   * @see https://api.slack.com/methods/chat.update
   */
  function updateMessage(token, ts, channel, text, callback) {
    const qs = {
      ts: ts,
      channel: channel,
      text: text
    };

    apiCall(token, 'chat.update', qs, callback);
  }

  /**
   * @name deleteMessage
   * @description Deletes a message from a channel.
   * @param {String} token Token of authenticated user
   * @param {String} ts Message timestamp
   * @param {String} channel Channel
   * @param {Function} callback
   * @return Nothing
   * @see https://api.slack.com/methods/chat.delete
   */
  function deleteMessage(token, ts, channel, callback) {
    const qs = {
      ts: ts,
      channel: channel
    };

    apiCall(token, 'chat.delete', qs, callback);
  }

  /**
   * @name apiCall
   * @description Makes a request to Slack's API based on their conventions.
   * @param {String} token Token of authenticated user
   * @param {String} method The method name
   * @param {Object} qs A key/value pair of query string params
   * @return Nothing
   * @see https://api.slack.com/web
   */
  function apiCall(token, method, qs) {
    qs = qs || {};
    qs['token'] = token;

    const options = {
      url: method,
      baseUrl: 'https://slack.com/api/',
      qs: qs
    };

    return new Promise((resolve, reject) => {
      request.post(options, (error, response, body) => {
        if (!error) {
          if (response.statusCode === 200) {
            resolve(JSON.parse(body));
          } else {
            reject({
              ok: false,
              error: 'API Response: ' + response.statusCode
            });
          }
        } else {
          reject({
            ok: false,
            error: 'Connection to RTM failed.'
          });
        }
      });
    });
  }

}

module.exports = api();
