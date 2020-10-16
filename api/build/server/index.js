"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var koa_session_1 = __importDefault(require("koa-session"));
var koa_passport_1 = __importDefault(require("koa-passport"));
var koa_redis_1 = __importDefault(require("koa-redis"));
var koa_static_1 = __importDefault(require("koa-static"));
var path_1 = __importDefault(require("path"));
var config_1 = __importDefault(require("../config"));
var players_js_1 = __importDefault(require("../routes/players.js"));
var users_js_1 = __importDefault(require("../routes/users.js"));
var auth_js_1 = __importDefault(require("../routes/auth.js"));
var PORT = parseInt(config_1.default.PORT) || 1337;
var app = new koa_1.default();
var StaticSiteBuild = path_1.default.join(__dirname, "public");
//sessions
app.keys = [config_1.default.SECRETKEY];
app.use(koa_session_1.default({ store: koa_redis_1.default({}) }, app));
//body parser
app.use(koa_bodyparser_1.default({}));
//authentication
require("./auth");
app.use(koa_passport_1.default.initialize());
app.use(koa_passport_1.default.session());
console.log(StaticSiteBuild);
//routes
app.use(koa_static_1.default(StaticSiteBuild));
app.use(players_js_1.default.routes());
app.use(users_js_1.default.routes());
app.use(auth_js_1.default.routes());
// server
var server = app.listen(PORT, function () {
    console.log("Server listening on port: " + PORT);
});
exports.default = server;