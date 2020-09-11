"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var koa_session_1 = __importDefault(require("koa-session"));
var koa_passport_1 = __importDefault(require("koa-passport"));
var koa_redis_1 = __importDefault(require("koa-redis"));
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var index_js_1 = __importDefault(require("../routes/index.js"));
var players_js_1 = __importDefault(require("../routes/players.js"));
var users_js_1 = __importDefault(require("../routes/users.js"));
var auth_js_1 = __importDefault(require("../routes/auth.js"));
var PORT = process.env.PORT || 1337;
var app = new koa_1.default();
//sessions
app.keys = [process.env.SECRETKEY];
app.use(koa_session_1.default({ store: koa_redis_1.default({}) }, app));
//body parser
app.use(koa_bodyparser_1.default({}));
//authentication
require("./auth.js");
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
