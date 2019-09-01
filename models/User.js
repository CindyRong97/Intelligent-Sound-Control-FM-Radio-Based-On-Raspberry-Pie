/**
 * User.js
 *
 * @description :: 定义用户属性
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    userUUID: {
      type: 'string',
      primaryKey: true,
      unique: true,
      size: 64,
      defaultsTo: function () {
        return uuidv4();
      }
    },
    userName: {
      type: 'string',
      index: true,
      unique: true
    },
    userNick: {
      type: 'string',
    },
    userPassword: {
      type: 'string'
    },
    userRegister: {
      type: 'integer',
      defaultsTo: function () {
        return Math.round((new Date()).valueOf() / 1000);
      }
    },
    userRole: {
      type: 'string',
      enum: ['admin', 'masterjudge', 'judge', 'teamleader']
    },
    userMail: {
      type: 'string',
      index: true
    },
    attachUUID: {
      type: 'string',
      index: true
    },
    status: {
      type: 'string',
      index: true,
      size: 64,
      enum: ['pending', 'accepted', 'canceled']
    }
  },
  beforeCreate: function(values, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(values.userPassword, salt, function(err, hash) {
        if (err) return cb(err);
        values.userPassword = hash;
        console.log(values.userPassword);
        cb();
      });
    });
  }
};

