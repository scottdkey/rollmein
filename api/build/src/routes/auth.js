"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const Auth_1 = require("../db/controllers/Auth");
const keys_1 = __importDefault(require("../config/keys"));
const Users_1 = require("../db/controllers/Users");
const router = new koa_router_1.default();
// current prefix is /api/v1/auth
router.prefix(`${keys_1.default.BASE_URL}/auth`);
router.get(`/status`, async (ctx) => { await Auth_1.AuthStatus(ctx); });
router.post("/register", async (ctx, next) => {
    ctx = await Users_1.addUser(ctx);
    await Auth_1.LoginUser(ctx, next);
});
router.post("/login", async (ctx, next) => { await Auth_1.LoginUser(ctx, next); });
router.get("/logout", async (ctx) => { await Auth_1.LogoutUser(ctx); });
exports.default = router;
