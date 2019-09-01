/**
 * Competion.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const uuidv4 = require('uuid/v4');

module.exports = {

  attributes: {
    bisaiUUID: {
      type: 'string',
      primaryKey: true,
      unique: true,
      size: 64,
      defaultsTo: function () {
        return uuidv4();
      }
    },
    bisaiName: {
      type: 'string',
    },
    openRegister: {
      type: 'integer',
      index: true,
      defaultsTo: function () {
        return 0;
      }
    },
    ageGup: {
      type: 'integer',
      index: true,
      enum: [1, 2, 3],
    },
    sexGup: {
      type: 'string',
      index: true,
      size: 4,
      enum: ['M', 'F']
    },
    running: {
      type: 'int',
      index: true,
      defaultsTo: function () {
        return 0;
      }
    }
  }
};

