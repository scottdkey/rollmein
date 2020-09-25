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
var config_1 = __importDefault(require("../../config"));
var index_js_1 = __importDefault(require("../routes/index.js"));
var players_js_1 = __importDefault(require("../routes/players.js"));
var users_js_1 = __importDefault(require("../routes/users.js"));
var auth_js_1 = __importDefault(require("../routes/auth.js"));
var Keys = config_1.default;
var PORT = parseInt(Keys.PORT) || 1337;
var app = new koa_1.default();
//sessions
app.keys = [Keys.SECRETKEY];
app.use(koa_session_1.default({ store: koa_redis_1.default({}) }, app));
//body parser
app.use(koa_bodyparser_1.default({}));
//authentication
require("./auth");
app.use(koa_passport_1.default.initialize());
app.use(koa_passport_1.default.session());
//routes
app.use(index_js_1.default.routes());
app.use(players_js_1.default.routes());
app.use(users_js_1.default.routes());
app.use(auth_js_1.default.routes());
// server
var server = app.listen(PORT, function () {
    console.log("Server listening on port: " + PORT);
});
exports.default = server;
