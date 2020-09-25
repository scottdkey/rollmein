"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1)
            throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f)
            throw new TypeError("Generator is already executing.");
        while (_)
            try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                    return t;
                if (y = 0, t)
                    op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0:
                    case 1:
                        t = op;
                        break;
                    case 4:
                        _.label++;
                        return { value: op[1], done: false };
                    case 5:
                        _.label++;
                        y = op[1];
                        op = [0];
                        continue;
                    case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                            _.label = op[1];
                            break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];
                            _.ops.push(op);
                            break;
                        }
                        if (t[2])
                            _.ops.pop();
                        _.trys.pop();
                        continue;
                }
                op = body.call(thisArg, _);
            }
            catch (e) {
                op = [6, e];
                y = 0;
            }
            finally {
                f = t = 0;
            }
        if (op[0] & 5)
            throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_passport_1 = __importDefault(require("koa-passport"));
var passport_local_1 = __importDefault(require("passport-local"));
var passport_facebook_1 = __importDefault(require("passport-facebook"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var config_1 = __importDefault(require("../../config"));
var connection_js_1 = __importDefault(require("../db/connection.js"));
var LocalStrategy = passport_local_1.default.Strategy;
var FacebookStrategy = passport_facebook_1.default.Strategy;
koa_passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
koa_passport_1.default.deserializeUser(function (id, done) {
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection_js_1.default("users")
                        .where({ id: id })
                        .first()
                        .then(function (user) {
                        done(null, user);
                    })
                        .catch(function (err) {
                        done(err, null);
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
});
var localStratOptions = { usernameField: "email" };
koa_passport_1.default.use(new LocalStrategy(localStratOptions, function (username, password, done) {
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
var fbStratOptions = {
    clientID: config_1.default.FACEBOOK_CID,
    clientSecret: config_1.default.FACEBOOK_CS,
    callbackURL: "/auth/facebook/callback"
};
koa_passport_1.default.use(new FacebookStrategy(fbStratOptions, function (token, tokenSecret, profile, done) {
    console.log("About to create a user w/ profile data: " + profile);
    console.log("Got TOKEN: " + token);
    connection_js_1.default("users").where({ id: profile.id }).then(function (results) {
        if (results.length < 1) {
            console.log("About to create user: " + results);
            return connection_js_1.default('users').insert(__assign({}, profile)).returning("*").then(function (user) {
                console.log("Created user: " + user);
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
