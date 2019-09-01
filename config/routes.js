/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': 'IndexController.index',
  'get /login': {view: 'login'},
  'get /register': {view: 'register'},
  'post /login': 'LoginController.login',
  'post /register': 'LoginController.register',

  'get /admin': 'AdminController.admin',
  'get /admin/bisai/:uuid': 'AdminController.bisaiInfo',
  'get /admin/userinfo': 'AdminController.userinfo',
  'get /admin/update_user': 'AdminController.updateUser',

  'post /admin/batch_reg': 'AdminController.batchRegister',

  'post /admin/update': 'AdminController.update',
  'post /admin/update_bisai': 'AdminController.updateBisai',

  'get /teamleader': 'TeamleaderController.teamleader',
  'get /teamleader/edit_athlete/:uuid': 'TeamleaderController.editAthlete',
  'post /teamleader/edit_athlete': 'TeamleaderController.postAthlete',
  'post /teamleader/edit_athlete/:uuid': 'TeamleaderController.postAthlete',

  'get /masterjudge/state': 'MasterjudgeController.get_state',
  'get /judge/state': 'JudgeController.get_state',

  'get /masterjudge/postscore': 'MasterjudgeController.post_score',

  'get /masterjudge': {view: 'judge/master'},
  'get /judge': {view: 'judge/slave'},

  'get /judge/whoami': 'JudgeController.whoami',
  'get /judge/postscore': 'JudgeController.post_score',

  'get /screen/state': 'MasterjudgeController.get_state',

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
