/**
 * LoginController
 *
 * @description :: Server-side logic for managing logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

import {promisify} from 'util';
let passport = require('passport');

function executeDBAsync(what) {
  return new Promise((resolve, reject) => {
    what.exec(
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    )
  });
}

module.exports = {
	login: (function(req, res) {
	  let param = req.allParams();
	  let redirect = false;
	  passport.authenticate('local', function(err, user, info) {
	    if ((err) || (!user)) {
        return res.send({
          message: info.message,
          user: user
        });
      }
      req.logIn(user, function(err) {
        if (err) res.send(err);
        res.redirect('/');
      });
    })(req, res);
  }),
  register: (async function(req, res) {
    try {
      let user = req.allParams();
      let created = await executeDBAsync(User.create({
        userName: user.userName,
        userPassword: user.userPassword,
        userNick: user.userName,
        userRole: user.userName === 'admin' ? 'admin' : 'teamleader'
      }));
      req.logIn(created, function(err) {
        if (err) {return next(err);}
        return res.redirect('/'+(user.userName === 'admin' ? 'admin' : 'teamleader'));
      })
    } catch (e) {
      console.log(e);
      res.view('register', {err: e});
    }
  })
};

