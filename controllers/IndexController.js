/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: (function(req, res) {
	  console.log(req.user);
	  if (req.user) {
	    res.redirect('/' + req.user.userRole);
    } else
      res.view('login');
  }),
};

