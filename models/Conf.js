/**
 * Conf.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    key: {
      type: 'string',
      size: 64,
      unique: true,
    },
    type: {
      type: 'string'
    },
    value: {
      type: 'string'
    }
  }
};

