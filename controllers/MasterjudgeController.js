/**
 * MasterjudgeController
 *
 * @description :: Server-side logic for managing Masterjudges
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
	get_state: (async function(req, res) {
	  try {
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
      if (p.act === 'accept') {
        let max_score = max(Number(cansai_res.score.s0), Number(cansai_res.score.s1), Number(cansai_res.score.s2), Number(cansai_res.score.s3), Number(cansai_res.score.s4));
        let min_score = min(Number(cansai_res.score.s0), Number(cansai_res.score.s1), Number(cansai_res.score.s2), Number(cansai_res.score.s3), Number(cansai_res.score.s4));
        let tot_score = Number(cansai_res.score.s0) + Number(cansai_res.score.s1) + Number(cansai_res.score.s2) + Number(cansai_res.score.s3) + Number(cansai_res.score.s4);
        if (min_score === 0) {
          res.send({result: 'none', text: '打分尚未完成'});
          return;
        }
        tot_score = tot_score - max_score - min_score;
        tot_score /= 3;
        tot_score += Number(cansai_res.score.d || 0);
        tot_score -= Number(cansai_res.score.p || 0);
        cansai_res.finalScore = tot_score;
        await executeDBAsync(Cansai.update({recordUUID: current_judging}, {finalScore: tot_score}));
        res.send({result: 'ok'});
      } else if (p.act === 's0' || p.act === 's1' || p.act === 's2' || p.act === 's3' || p.act === 's4') {
        cansai_res.score[p.act] = 0;
        await executeDBAsync(Cansai.update({recordUUID: current_judging}, {score: cansai_res.score}));
        res.send({result: 'ok'});
      } else if (p.act === 'submit_dp') {
        cansai_res.score.p = p.p;
        cansai_res.score.d = p.d;
        await executeDBAsync(Cansai.update({recordUUID: current_judging}, {score: cansai_res.score}));
        res.send({result: 'ok'});
      }
    } catch (e) {
      console.log(e);
      res.serverError(e);
    }
  }),
};

