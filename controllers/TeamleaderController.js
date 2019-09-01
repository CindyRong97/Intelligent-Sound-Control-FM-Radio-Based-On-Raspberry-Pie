/**
 * TeamleaderController
 *
 * @description :: Server-side logic for managing teamleaders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

import {promisify} from 'util';

const phoneReg = /^(1\d{10}|\d{8})$/;

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
	teamleader: (async function(req, res) {
	  try {
	    let users = await executeDBAsync(Duiyuan.find({leaderUUID: req.user.userUUID}));
	    res.view('team/info', {users});
    } catch (e) {
	    console.log(e);
	    res.serverError(e);
    }
  }),

  editAthlete: (async function(req, res) {
    try {
      let uuid = req.param('uuid');
      let athlete = await executeDBAsync(Duiyuan.findOne({duiyuanUUID: uuid}));
      if (!athlete) res.redirect('/');
      let availablePrograms = await executeDBAsync(Competion.find({ageGup: athlete.ageGup, sexGup: athlete.gender}));
      let inPrograms = await executeDBAsync(Cansai.find({duiyuanUUID: uuid}));
      let bisai = {}, cansai = {};
      availablePrograms.forEach(function(e) {
        bisai[e.bisaiUUID] = e;
      });
      inPrograms.forEach(function(e) {
        cansai[e.bisaiUUID] = e;
      });
      console.log(uuid);
      console.log(athlete);
      console.log(availablePrograms);
      console.log(inPrograms);
      res.view('team/athlete', {athlete: athlete, bisai: bisai, cansai: cansai, bisaiLst: availablePrograms});
    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  }),

  postathlete: (async function(req, res) {
    try {
      let teammember = req.allParams();
      if (teammember.act === 'create') {
        let isLeader = (teammember.isLeader === 'true' ? 1 : 0);
        let isDuiyi = (teammember.isDuiyi === 'true' ? 1 : 0);
        let isAthlete = (teammember.isAthlete === 'true' ? 1 : 0);
        let isCoach = (teammember.isCoach === 'true' ? 1 : 0);
        if (!phoneReg.test(teammember.phone) && teammember.phone !== '') {
          teammember.phone = '';
        }
        if (isLeader || isDuiyi || isCoach) {
          if (teammember.phone === '') res.redirect('/');
        }
        let age = (new Date()).getFullYear() - Number(teammember.idcd.substr(6, 4));
        let sex = (Number(teammember.idcd.substr(16, 1)) % 2 === 1) ? 'M' : 'F';
        let ageGup = 0;
        if (isAthlete) {
          if (age >= 7 && age <= 8) ageGup = 1;
          else if (age >= 9 && age <= 10) ageGup = 2;
          else if (age >= 11 && age <= 12) ageGup = 3;
        }
        let res = await executeDBAsync(Duiyuan.create({
          isAthlete: isAthlete,
          isLeader: isLeader,
          isCoach: isCoach,
          isDuiyi: isDuiyi,
          leaderUUID: req.user.userUUID,
          ageGup: ageGup,
          name: teammember.name,
          idcd: teammember.idcd,
          gender: sex,
          phone: teammember.phone
        }));
      } else if (teammember.act === 'delete') {
        await executeDBAsync(Duiyuan.destroy({duiyuanUUID: teammember.uuid}));
        await executeDBAsync(Cansai.destroy({duiyuanUUID: teammember.uuid}));
      } else if (teammember.act === 'register') {
        await executeDBAsync(Cansai.create({duiyuanUUID: teammember.duiyuanUUID, bisaiUUID: teammember.uuid}));
        res.redirect('/teamleader/edit_athlete/' + teammember.duiyuanUUID);
        return;
      } else if (teammember.act === 'deregister') {
        await executeDBAsync(Cansai.destroy({duiyuanUUID: teammember.duiyuanUUID, bisaiUUID: teammember.uuid}));
        res.redirect('/teamleader/edit_athlete/' + teammember.duiyuanUUID);
        return;
      }
      res.redirect('/');
    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  }),
};

