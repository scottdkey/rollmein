"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const keys_1 = __importDefault(require("../config/keys"));
const User_1 = require("../db/models/User");
const Users_1 = require("../db/controllers/Users");
const router = new koa_router_1.default();
//current prefix is /api/v1/users
router.prefix(`${keys_1.default.BASE_URL}/${User_1.userTable}`);
router.get(`/`, async (ctx) => {
    ctx.body = await Users_1.getAllUsers();
});
router.get(`/:uuid`, async (ctx) => {
    const { uuid } = ctx.params;
    ctx.body = await Users_1.getUserByUUID(uuid);
});
router.post(`/`, async (ctx) => {
    await Users_1.addUser(ctx).then(res => ctx = res).catch(e => ctx.throw(401, "Error unable to create user", e));
});
router.delete(`/:uuid`, async (ctx) => {
    const { uuid } = ctx.params;
    ctx.body = `Delete User ${uuid}`;
});
router.patch(`/:uuid`, async (ctx) => { ctx.body = `Patch user ${ctx.params.uuid}`; });
exports.default = router;
