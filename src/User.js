/* =============================================================================
    Name: User.js
    Description: User class.
    Author: Nick Salloum
    License: MIT
============================================================================= */

/**
 * @class Builds a User.
 * @namespace User
 */
class User {

  /**
   * @constructor
   * @description Constructor for User class.
   * @param {String} id The user id.
   * @param {Object} user A user response from Slack's API.
   */
  constructor(id, user) {
    this.id = id;
    this.team_id = user.team_id;
    this.name = user.name;
    this.status = user.status;
    this.color = user.color;
    this.real_name = user.real_name;
    this.is_bot = user.is_bot;
    this.presence = user.presence;
  }

}

module.exports = User;
