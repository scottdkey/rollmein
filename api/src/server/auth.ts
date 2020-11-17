import passport from "koa-passport";
import passportLocal from "passport-local";
import passportFB from "passport-facebook";
import { checkUserPassword, getUser } from "../db/controllers/Users";
import { UserInterface, userTable, User } from "../db/models/user";
import { query } from "../db"

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFB.Strategy;

passport.serializeUser((user: UserInterface, done) => { done(null, user.id); });

passport.deserializeUser(async (uuid: string, done) => { getUser(uuid, done) });

const localStratOptions = { usernameField: "email" };

passport.use(
  new LocalStrategy(localStratOptions, (username: string, password: string, done) => {
    checkUserPassword(username, password, done)
  }))
// const fbStratOptions = {
//   clientID: keys.FACEBOOK_CID,
//   clientSecret: keys.FACEBOOK_CS,
//   callbackURL: "/auth/facebook/callback"
// }

// passport.use(new FacebookStrategy(fbStratOptions, (token, tokenSecret, profile, done) => {
//   knex("users").where({ id: profile.id }).then(results => {
//     if (!results) {
//       return knex('users').insert({ ...profile }).returning("*").then(user => {
//         return done(null, user)
//       })
//     } else {
//       return done(null, results[0])
//     }
//   })
// }))
