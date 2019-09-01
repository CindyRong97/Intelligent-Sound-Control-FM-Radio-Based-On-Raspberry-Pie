/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

import {promisify} from 'util';

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
	admin: (async function(req, res) {
	  let key_val = await executeDBAsync(Conf.find());
	  let bisai = await executeDBAsync(Competion.find());
	  res.view('admin/conf', {key_val, bisai});
  }),

  update: (async function(req, res) {
    try {
      let p = req.allParams();
      if (p.act === 'create') {
        let v = await executeDBAsync(Conf.create({key: p.key}));
      } else if (p.act === 'edit') {
        let v = await executeDBAsync(Conf.findOne({key: p.key}));
        if (v) {
          await executeDBAsync(Conf.update({key: p.key}, {value: p.value}));
        } else {
          await executeDBAsync(Conf.create({key: p.key, value: p.value}));
        }
      } else if (p.act === 'delete') {
        await executeDBAsync(Conf.destroy({key: p.key}));
      }
      if (p.redirect) {res.redirect(p.redirect);}
      else {res.redirect('/admin');}
    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  }),

  updateBisai: (async function(req, res) {
    try {
      let p = req.allParams();
      if (p.act === 'create') {
        await executeDBAsync(Competion.create({
          bisaiName: p.name,
          ageGup: Number(p.ageGup),
          sexGup: p.sexGup
        }));
      } else if (p.act === 'running') {
        await executeDBAsync(Competion.update({bisaiUUID: p.uuid}, {running: (p.value === '1' ? 1 : 0)}));
      } else if (p.act === 'openRegister') {
        await executeDBAsync(Competion.update({bisaiUUID: p.uuid}, {openRegister: (p.value === '1' ? 1 : 0)}));
      } else if (p.act === 'delete') {
        await executeDBAsync(Competion.destroy({bisaiUUID: p.uuid}));
        await executeDBAsync(Cansai.destroy({bisaiUUID: p.uuid}));
      }
      if (p.redirect) {res.redirect(p.redirect);}
      else {res.redirect('/admin');}
    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  }),

  bisaiInfo: (async function(req, res) {
    try {
      let uuid = req.param('uuid');
      let bisaimeta = await executeDBAsync(Competion.findOne({bisaiUUID: uuid}));
      let athletes = await executeDBAsync(Cansai.find({bisaiUUID: uuid}).sort('finalScore DESC'));
      let allathletes = await executeDBAsync(Duiyuan.find());
      let allteams = await executeDBAsync(User.find({userRole: 'teamleader'}));

      let similarComp = await executeDBAsync(Competion.find({ageGup: bisaimeta.ageGup, sexGup: bisaimeta.sexGup}))
      let athletedict = {}, teamdict = {};
      allteams.forEach(function (e) {
        teamdict[e.userUUID] = e;
      });
      allathletes.forEach(function (e) {
        athletedict[e.duiyuanUUID] = e;
      });
      res.view('admin/bisai', {athletes: athletes, athletedict, teamdict, bisaimeta, similarComp});
    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  }),

  userInfo: (async function(req, res) {
    try {
      let users = await executeDBAsync(User.find());
      res.view('admin/users', {users});
    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  }),

  updateUser: (async function(req, res) {
    try {
      let p = req.allParams();
      await executeDBAsync(User.update({userUUID: p.uuid}, {userRole: p.role, userNick: p.nick}));
      if (p.redirect) {res.redirect(p.redirect);}
      else {res.redirect('/admin');}
    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  }),

  batchRegister: (async function (req, res) {
    try {
      let p = req.allParams();
      console.log(p);
      let c = p.select_comp;
      let s = p.selected.split(',');
      s.forEach(async function (e) {
        let r = await executeDBAsync(Duiyuan.findOne({duiyuanUUID: e}));
        let f = await executeDBAsync(Cansai.findOne({duiyuanUUID: e, bisaiUUID: c}));
        if (r && !f)
        {
          await executeDBAsync(Cansai.create({duiyuanUUID: e, bisaiUUID: c}));
        }
      });
      res.redirect('/admin');
    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  }),
};

