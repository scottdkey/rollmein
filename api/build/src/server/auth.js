"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_passport_1 = __importDefault(require("koa-passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config"));
const connection_js_1 = __importDefault(require("../db/connection.js"));
const LocalStrategy = passport_local_1.default.Strategy;
const FacebookStrategy = passport_facebook_1.default.Strategy;
koa_passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
koa_passport_1.default.deserializeUser(async (id, done) => {
    return await connection_js_1.default("users")
        .where({ id })
        .first()
        .then((user) => {
        done(null, user);
    })
        .catch((err) => {
        done(err, null);
    });
});
const localStratOptions = { usernameField: "email" };
koa_passport_1.default.use(new LocalStrategy(localStratOptions, (username, password, done) => {
    connection_js_1.default("users")
        .where({ email: username })
        .first()
        .then((user) => {
        if (!user)
            return done(null, false);
        if (!comparePass(password, user.password)) {
            return done(null, false);
        }
        else {
            return done(null, user);
        }
    })
        .catch((err) => {
        return done(err);
    });
}));
const fbStratOptions = {
    clientID: config_1.default.FACEBOOK_CID,
    clientSecret: config_1.default.FACEBOOK_CS,
    callbackURL: "/auth/facebook/callback"
};
koa_passport_1.default.use(new FacebookStrategy(fbStratOptions, (token, tokenSecret, profile, done) => {
    connection_js_1.default("users").where({ id: profile.id }).then(results => {
        if (!results) {
            return connection_js_1.default('users').insert({ ...profile }).returning("*").then(user => {
                return done(null, user);
            });
        }
        else {
            return done(null, results[0]);
        }
    });
}));
function comparePass(userPassword, databasePassword) {
    return bcryptjs_1.default.compareSync(userPassword, databasePassword);
}
