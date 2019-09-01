/**
 * Cansai.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const uuidv4 = require('uuid/v4');

module.exports = {

  attributes: {
    recordUUID: {
      type: 'string',
      index: true,
      size: 64,
      defaultsTo: function () {
        return uuidv4();
      }
    },
    duiyuanUUID: {
      type: 'string',
      index: true,
      size: 64,
    },
    bisaiUUID: {
      type: 'string',
      index: true,
      size: 64,
    },
    finalScore: {
      type: 'integer',
      index: true,
      defaultsTo: 0,
    },
    score: {
      type: 'json',
      defaultsTo: function() {
        return {s0: 0, s1: 0, s2: 0, s3: 0, s4: 0, d: 0, p: 0}
      }
    }
  }
};

