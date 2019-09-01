/**
 * JudgeController
 *
 * @description :: Server-side logic for managing judges
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
  whoami: (async function(req, res) {
    try {
      let s0 = (await executeDBAsync(Conf.findOne({key: 's0'}))).value;
      let s1 = (await executeDBAsync(Conf.findOne({key: 's1'}))).value;
      let s2 = (await executeDBAsync(Conf.findOne({key: 's2'}))).value;
      let s3 = (await executeDBAsync(Conf.findOne({key: 's3'}))).value;
      let s4 = (await executeDBAsync(Conf.findOne({key: 's4'}))).value;
      //--
      if (req.user.userUUID === s0) {
        res.send({result: 's0'});
      } else if (req.user.userUUID === s1) {
        res.send({result: 's1'});
      } else if (req.user.userUUID === s2) {
        res.send({result: 's2'});
      } else if (req.user.userUUID === s3) {
        res.send({result: 's3'});
      } else if (req.user.userUUID === s4) {
        res.send({result: 's4'});
      } else {
        res.send({result: 'none'});
      }
    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  }),

  get_state: (async function(req, res) {
    try {

      let s0 = (await executeDBAsync(Conf.findOne({key: 's0'}))).value;
      let s1 = (await executeDBAsync(Conf.findOne({key: 's1'}))).value;
      let s2 = (await executeDBAsync(Conf.findOne({key: 's2'}))).value;
      let s3 = (await executeDBAsync(Conf.findOne({key: 's3'}))).value;
      let s4 = (await executeDBAsync(Conf.findOne({key: 's4'}))).value;

      let role = '';

      console.log(req.user);

      if (req.user.userUUID === s0) {
        role = 's0';
      } else if (req.user.userUUID === s1) {
        role = 's1';
      } else if (req.user.userUUID === s2) {
        role = 's2';
      } else if (req.user.userUUID === s3) {
        role = 's3';
      } else if (req.user.userUUID === s4) {
        role = 's4';
      } else {
        res.send({result: 'none', text: '没有打分权限'});
        return;
      }

      let current_val = await executeDBAsync(Conf.findOne({key: 'current_judging'}));
      if (!current_val) {
        res.send({
          result: 'none',
          text: '当前没有打分项目'
        });
        return;
      }
      let current_judging = current_val.value;
      console.log(current_judging);
      let cansai_res = await executeDBAsync(Cansai.findOne({recordUUID: current_judging}));
      if (!cansai_res) {
        res.send({
          result: 'none',
          text: '当前没有打分项目'
        });
        return;
      }
      console.log(cansai_res);

      let valid_score = cansai_res.score[role];
      if (!cansai_res.finalScore) {
        cansai_res.score = {s0: '-', s1: '-', s2: '-', s3: '-', s4: '-', s5: '-', d: '-', p: '-'};
        cansai_res.score[role] = valid_score;
      }

      let duiyuan = await executeDBAsync(Duiyuan.findOne({duiyuanUUID: cansai_res.duiyuanUUID}));
      let team = await executeDBAsync(User.findOne({userUUID: duiyuan.leaderUUID}));
      let bisai = await executeDBAsync(Competion.findOne({bisaiUUID: cansai_res.bisaiUUID}));
      //
      if (!duiyuan || !team || !bisai) {
        res.send({
          result: 'none',
          text: '当前没有打分项目'
        });
        return;
      }
      team.userPassword = '';
      //
      res.send({result: 'yes', duiyuan, team, bisai, cansai: cansai_res});
    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  }),

  post_score: (async function(req, res) {
    try {

      let s0 = (await executeDBAsync(Conf.findOne({key: 's0'}))).value;
      let s1 = (await executeDBAsync(Conf.findOne({key: 's1'}))).value;
      let s2 = (await executeDBAsync(Conf.findOne({key: 's2'}))).value;
      let s3 = (await executeDBAsync(Conf.findOne({key: 's3'}))).value;
      let s4 = (await executeDBAsync(Conf.findOne({key: 's4'}))).value;

      let role = '';
      //--
      if (req.user.userUUID === s0) {
        role = 's0';
      } else if (req.user.userUUID === s1) {
        role = 's1';
      } else if (req.user.userUUID === s2) {
        role = 's2';
      } else if (req.user.userUUID === s3) {
        role = 's3';
      } else if (req.user.userUUID === s4) {
        role = 's4';
      } else {
        res.send({result: 'none', text: '没有打分权限'});
        return;
      }

      let current_val = await executeDBAsync(Conf.findOne({key: 'current_judging'}));
      if (!current_val) {
        res.send({
          result: 'none',
          text: '当前没有打分项目'
        });
        return;
      }
      let current_judging = current_val.value;
      console.log(current_judging);
      let cansai_res = await executeDBAsync(Cansai.findOne({recordUUID: current_judging}));
      if (!cansai_res) {
        res.send({
          result: 'none',
          text: '当前没有打分项目'
        });
        return;
      }
      console.log(cansai_res);
      let duiyuan = await executeDBAsync(Duiyuan.findOne({duiyuanUUID: cansai_res.duiyuanUUID}));
      let team = await executeDBAsync(User.findOne({userUUID: duiyuan.leaderUUID}));
      let bisai = await executeDBAsync(Competion.findOne({bisaiUUID: cansai_res.bisaiUUID}));
      //
      if (!duiyuan || !team || !bisai) {
        res.send({
          result: 'none',
          text: '当前没有打分项目'
        });
        return;
      }

      let p = req.allParams();
      if (p.act === 'submit') {
        cansai_res.score[role] = Number(p.s);
        await executeDBAsync(Cansai.update({recordUUID: current_judging}, {score: cansai_res.score}));
        res.send({result: 'ok'});
      }
    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  }),
};
