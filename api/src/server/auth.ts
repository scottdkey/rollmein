import passport from "koa-passport";
import passportLocal from "passport-local";
import passportFB from "passport-facebook";
import { getUserByUUID, getUserByEmail, comparePass } from "../db/controllers/Users";
import { UserInterface, userTable, User } from "../db/models/User";
import { query } from "../db"

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFB.Strategy;

passport.serializeUser((user: UserInterface, done) => { done(null, user.id); });

passport.deserializeUser(async (uuid: string, done) => {
  await getUserByUUID(uuid).then(user => done(null, user)).catch(e => done(e, null))

});

const localStratOptions = { usernameField: "email" };

passport.use(
  new LocalStrategy(localStratOptions, async (username: string, password: string, done) => {
    await getUserByEmail(username).then(user => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!comparePass(password, user.password!)) {
        return done(null, false, { message: "Incorrect password." });
      } else {
        return done(null, user);
      }
    }).catch(e => {
      return done(e);
    })
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
