var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
  done(null, user.uuid);
});

passport.deserializeUser(function(userUUID, done) {
  User.findOne({userUUID: userUUID}, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'userPassword'
  },
  function(userName, userPassword, done) {
    User.findOne({userName: userName}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'User does not exist'});
      }
      bcrypt.compare(userPassword, user.userPassword, function(err, res) {
        if (!res) {
          return done(null, false, {message: 'Incorrect password'});
        }
        var returnUser = {
          uuid: user.userUUID,
          name: user.userName
        };
        return done(null, returnUser, {
          message: "Logged in successfully"
        });
      });
    });
  }
));
