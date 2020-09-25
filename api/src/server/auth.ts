import passport from "koa-passport";
import passportLocal from "passport-local";
import passportFB from "passport-facebook";
import bcrypt from "bcryptjs";
import keys from "../../config"
import { UserInfo } from "../../config/interfaces"

import knex from "../db/connection.js";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFB.Strategy;



// const { FB_CLINET_ID, FB_CLIENT_SECRET } = process.env;



passport.serializeUser((user: UserInfo, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  return await knex("users")
    .where({ id })
    .first()
    .then((user: UserInfo) => {
      done(null, user);
    })
    .catch((err: any) => {
      done(err, null);
    });
});

const localStratOptions = { usernameField: "email" };

passport.use(
  new LocalStrategy(localStratOptions, (username: string, password: string, done) => {
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
      .catch((err: any) => {
        return done(err);
      });
  })
);
const fbStratOptions = {
  clientID: keys.FACEBOOK_CID,
  clientSecret: keys.FACEBOOK_CS,
  callbackURL: "/auth/facebook/callback"
}

passport.use(new FacebookStrategy(fbStratOptions, (token, tokenSecret, profile, done) => {
  console.log(`About to create a user w/ profile data: ${profile}`)
  console.log(`Got TOKEN: ${token}`)
  knex("users").where({ id: profile.id }).then(results => {
    if (results.length < 1) {
      console.log(`About to create user: ${results}`)
      return knex('users').insert({ ...profile }).returning("*").then(user => {
        console.log(`Created user: ${user}`)
        return done(null, user)
      })
    } else {
      return done(null, results[0])
    }
  })
}))

function comparePass(userPassword: string, databasePassword: string) {
  return bcrypt.compareSync(userPassword, databasePassword);
}
