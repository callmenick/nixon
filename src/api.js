/* =============================================================================
    Name: api.js
    Description: A collection of functions that exposes the Slack API.
    Author: Nick Salloum
    License: MIT
============================================================================= */

const request = require('request');
const winston = require('winston');
const _ = require('lodash');

/**
 * @name rtmStart
 * @description Starts a Real Time Messaging API session.
 * @param {Function} cb Callback function
 * @see https://api.slack.com/methods/rtm.start
 */
function rtmStart(token, cb) {
  apiCall(token, 'rtm.start', null, cb);
}

/**
 * @name postMessage
 * @description Posts a message to a public channel, private group, or IM
 *   channel.
 * @param {String} channel Channel
 * @param {String} text Text string
 * @param {Function} cb Callback function
 * @see https://api.slack.com/methods/chat.postMessage
 */
function postMessage(token, channel, text, options, cb) {
  const qs = _.extend(options, {
    text: text,
    channel: channel,
    as_user: true
  });

  console.log(qs);

  apiCall(token, 'chat.postMessage', qs, cb);
}

/**
 * @name updateMessage
 * @description Updates a message in a channel.
 * @param {String} ts Message timestamp
 * @param {String} channel Channel
 * @param {String} text Text string
 * @param {Function} cb Callback function
 * @see https://api.slack.com/methods/chat.update
 */
function updateMessage(token, ts, channel, text, cb) {
  const qs = {
    ts: ts,
    channel: channel,
    text: text
  };

  apiCall(token, 'chat.update', qs, cb);
}

/**
 * @name deleteMessage
 * @description Deletes a message from a channel.
 * @param {String} ts Message timestamp
 * @param {String} channel Channel
 * @param {Function} cb Callback function
 * @see https://api.slack.com/methods/chat.delete
 */
function deleteMessage(token, ts, channel, cb) {
  const qs = {
    ts: ts,
    channel: channel
  };

  apiCall(token, 'chat.delete', qs, cb);
}

/**
 * @private
 * @name apiCall
 * @description Makes a request to Slack's API based on their conventions.
 * @param {String} method The method name
 * @param {Object} qs A key/value pair of query string params
 * @param {Function} cb Callback function
 * @see https://api.slack.com/web
 */
function apiCall(token, method, qs, cb) {
  qs = qs || {};
  qs['token'] = token;

  const options = {
    url: method,
    baseUrl: 'https://slack.com/api/',
    qs: qs
  };

  request.post(options, (error, response, body) => {
    if (!error) {
      if (cb) {
        if (response.statusCode === 200) {
          cb(JSON.parse(body));
        } else {
          cb({
            ok: false,
            error: 'API Response: ' + response.statusCode
          });
        }
      }
    } else {
      winston.error(error);
    }
  });
}

module.exports = {
  rtmStart: rtmStart,
  postMessage: postMessage,
  updateMessage: updateMessage,
  deleteMessage: deleteMessage
};
