import passport from "koa-passport";
import passportLocal from "passport-local";
import passportFB from "passport-facebook";
import bcrypt from "bcryptjs";

import knex from "../db/connection.js";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFB.Strategy;

const options = { usernameField: "email" };

const { FB_CLINET_ID, FB_CLIENT_SECRET } = process.env;

interface UserInfo {
  id: number;
  email: string;
  username: string;
  password: string;
}

passport.serializeUser((user: UserInfo, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: number, done) => {
  return knex("users")
    .where({ id })
    .first()
    .then((user: UserInfo) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

passport.use(
  new LocalStrategy(options, (username: string, password: string, done) => {
    knex("users")
      .where({ email: username })
      .first()
      .then((user: UserInfo) => {
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

function comparePass(userPassword: string, databasePassword: string) {
  return bcrypt.compareSync(userPassword, databasePassword);
}
