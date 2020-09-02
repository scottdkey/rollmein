const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook");
const bcrypt = require("bcryptjs");

const knex = require("../db/connection");

const options = { usernameField: "email" };

const { FB_CLINET_ID, FB_CLIENT_SECRET } = process.env;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  return knex("users")
    .where({ id })
    .first()
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

passport.use(
  new LocalStrategy(options, (username, password, done) => {
    knex("users")
      .where({ email: username })
      .first()
      .then((user) => {
        if (!user) return done(null, false);
        if (!comparePass(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      })
      .catch((err) => {
        return done(err);
      });
  })
);

passport.use(
  new FacebookStrategy({
    clientID: FB_CLINET_ID,
    clientSecret: FB_CLIENT_SECRET,
    callbackURL: "http://www.rollmein.com/auth/facebook/callback",
  }),
  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate(function (err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  }
);

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}
