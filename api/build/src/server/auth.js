"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_passport_1 = __importDefault(require("koa-passport"));
var passport_local_1 = __importDefault(require("passport-local"));
var passport_facebook_1 = __importDefault(require("passport-facebook"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var connection_js_1 = __importDefault(require("../db/connection.js"));
var LocalStrategy = passport_local_1.default.Strategy;
var FacebookStrategy = passport_facebook_1.default.Strategy;
var options = { usernameField: "email" };
var _a = process.env, FB_CLINET_ID = _a.FB_CLINET_ID, FB_CLIENT_SECRET = _a.FB_CLIENT_SECRET;
koa_passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
koa_passport_1.default.deserializeUser(function (id, done) {
    return connection_js_1.default("users")
        .where({ id: id })
        .first()
        .then(function (user) {
        done(null, user);
    })
        .catch(function (err) {
        done(err, null);
    });
});
koa_passport_1.default.use(new LocalStrategy(options, function (username, password, done) {
    connection_js_1.default("users")
        .where({ email: username })
        .first()
        .then(function (user) {
        if (!user)
            return done(null, false);
        if (!comparePass(password, user.password)) {
            return done(null, false);
        }
        else {
            return done(null, user);
        }
    })
        .catch(function (err) {
        return done(err);
    });
}));
function comparePass(userPassword, databasePassword) {
    return bcryptjs_1.default.compareSync(userPassword, databasePassword);
}
