/**
 * Duiyuan.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const uuidv4 = require('uuid/v4');

module.exports = {

  attributes: {
    duiyuanUUID: {
      type: 'string',
      primaryKey: true,
      unique: true,
      size: 64,
      defaultsTo: function () {
        return uuidv4();
      }
    },
    // 是不是运动员
    isAthlete: {
      type: 'integer',
      index: true
    },
    // 是不是领队
    isLeader: {
      type: 'integer',
      index: true
    },
    // 是不是教练
    isCoach: {
      type: 'integer',
      index: true
    },
    // 是不是裁判
    isJudge: {
      type: 'integer',
      index: true,
      defaultsTo: function () {
        return 0;
      }
    },
    // 是不是队医
    isDuiyi: {
      type: 'integer',
      index: true
    },
    leaderUUID: {
      type: 'string',
      index: true
    },
    ageGup: {
      type: 'integer',
      enum: [0, 1, 2, 3]
      // illegal 7-8 9-10 11-12
    },
    name: {
      type: 'string',
    },
    seqid: {
      type: 'string',
      size: 10,
      index: true
    },
    idcd: {
      type: 'string'
    },
    gender: {
      type: 'string',
      enum: ['N', 'M', 'F']
    },
    phone: {
      type: 'string'
    }
  }
};

