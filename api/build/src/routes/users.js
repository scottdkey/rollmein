"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const users_js_1 = __importDefault(require("../db/queries/users.js"));
const config_1 = __importDefault(require("../config"));
const router = new koa_router_1.default();
const BASE_URL = `${config_1.default.BASE_URL}/users`;
router.get(`${BASE_URL}`, async (ctx) => {
    try {
        const users = await users_js_1.default.getAllUsers();
        ctx.body = {
            status: "success",
            data: users,
        };
    }
    catch (err) {
        ctx.status = 404;
        ctx.body = "Error: Request not found";
    }
});
exports.default = router;
