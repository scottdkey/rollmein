"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_session_1 = __importDefault(require("koa-session"));
const koa_passport_1 = __importDefault(require("koa-passport"));
const koa_redis_1 = __importDefault(require("koa-redis"));
const keys_1 = __importDefault(require("../config/keys"));
const players_1 = __importDefault(require("../routes/players"));
const users_1 = __importDefault(require("../routes/users"));
const auth_1 = __importDefault(require("../routes/auth"));
const index_1 = __importDefault(require("../routes/index"));
const userOptions_1 = __importDefault(require("../routes/userOptions"));
const db_1 = require("../db");
const PORT = parseInt(keys_1.default.PORT) || 1337;
const app = new koa_1.default();
//body parser
app.use(koa_bodyparser_1.default({}));
//database
db_1.connect();
//sessions
app.keys = [keys_1.default.SECRETKEY];
app.use(koa_session_1.default({ store: koa_redis_1.default({}) }, app));
//authentication
require("./auth");
app.use(koa_passport_1.default.initialize());
app.use(koa_passport_1.default.session());
//routes
// app.use(serve(StaticSiteBuild));
app.use(index_1.default.routes());
app.use(users_1.default.routes());
app.use(players_1.default.routes());
app.use(userOptions_1.default.routes());
app.use(auth_1.default.routes());
// server
const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
exports.default = server;
