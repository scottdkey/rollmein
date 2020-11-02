"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const koa_passport_1 = __importDefault(require("koa-passport"));
const fs_1 = __importDefault(require("fs"));
const users_js_1 = __importDefault(require("../db/queries/users.js"));
const config_1 = __importDefault(require("../config"));
const router = new koa_router_1.default();
router.prefix(`${config_1.default.BASE_URL}/auth`);
router.get(`/status`, async (ctx) => {
    if (ctx.isAuthenticated()) {
        ctx.type = "html";
        const { user } = ctx.state;
        ctx.body = user;
    }
    else {
        ctx.body = "user is not authenticated";
        ctx.status = 401;
    }
});
router.get("/register", async (ctx) => {
    ctx.type = "html";
    ctx.body = fs_1.default.createReadStream("./src/views/register.html");
    if (ctx.isAuthenticated()) {
        ctx.redirect("/status");
    }
});
router.post("/register", async (ctx, next) => {
    await users_js_1.default.addUser(ctx.request.body);
    return koa_passport_1.default.authenticate("local", (err, user, info) => {
        if (user) {
            ctx.login(user, (err) => {
                if (err) {
                    return next();
                }
                return ctx.redirect("/status");
            });
        }
        if (err) {
            ctx.error = err;
            return next();
        }
        else {
            return ctx.redirect("/login");
        }
    })(ctx, next);
});
router.get("/login", async (ctx) => {
    if (!ctx.isAuthenticated()) {
        ctx.type = "html";
        ctx.body = fs_1.default.createReadStream("./src/views/login.html");
    }
    else {
        ctx.redirect("/status");
    }
});
router.post("/login", async (ctx, next) => {
    return koa_passport_1.default.authenticate("local", (err, user, info) => {
        failureFlash: "Invalid username or password.";
        if (user) {
            ctx.login(user, (err) => {
                if (err) {
                    ctx.body = { info };
                    return next();
                }
            });
            return ctx.body = user;
        }
        else if (err) {
            ctx.body = { ...info };
        }
        else {
            return ctx.logout();
        }
    })(ctx, next);
});
router.get("/logout", async (ctx) => {
    if (ctx.isAuthenticated()) {
        ctx.logout();
        // ctx.redirect("/login");
        ctx.body = { success: true };
        ctx.throw(200);
    }
    else {
        ctx.body = { success: false };
        ctx.throw(401);
    }
});
exports.default = router;
