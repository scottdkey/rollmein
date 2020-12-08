"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_passport_1 = __importDefault(require("koa-passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const Users_1 = require("../db/controllers/Users");
const LocalStrategy = passport_local_1.default.Strategy;
const FacebookStrategy = passport_facebook_1.default.Strategy;
koa_passport_1.default.serializeUser((user, done) => { done(null, user.id); });
koa_passport_1.default.deserializeUser(async (uuid, done) => {
    await Users_1.getUserByUUID(uuid).then(user => done(null, user)).catch(e => done(e, null));
});
const localStratOptions = { usernameField: "email" };
koa_passport_1.default.use(new LocalStrategy(localStratOptions, async (username, password, done) => {
    await Users_1.getUserByEmail(username).then(user => {
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (!Users_1.comparePass(password, user.password)) {
            return done(null, false, { message: "Incorrect password." });
        }
        else {
            return done(null, user);
        }
    }).catch(e => {
        return done(e);
    });
}));
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
