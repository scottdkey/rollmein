import Router from "koa-router";
import passport from "koa-passport";
import fs from "fs";
import queries from "../db/queries/users.js";
import { Context, DefaultState } from "koa";
import keys from "../../config"

const router = new Router<DefaultState, Context>();

router.prefix(`${keys.BASE_URL}/auth`)

router.get(`/status`, async (ctx) => {
  if (ctx.isAuthenticated()) {

    ctx.type = "html";
    const { user } = ctx.state
    ctx.body = { user, success: true }
  } else {
    ctx.body = { user: {}, success: false }
    ctx.redirect("/login");
  }
});

router.get("/register", async (ctx) => {
  ctx.type = "html";
  ctx.body = fs.createReadStream("./src/views/register.html");
  if (ctx.isAuthenticated()) {
    ctx.redirect("/status");
  }
});

router.post("/register", async (ctx, next) => {
  await queries.addUser(ctx.request.body);
  return passport.authenticate("local", (err: any, user, info) => {
    if (user) {
      ctx.login(user, (err: any) => {
        if (err) {
          return next();
        }
        return ctx.redirect("/status");
      });
    }
    if (err) {
      ctx.body = { error: info };
      return next();
    } else {
      return ctx.redirect("/login");
    }
  })(ctx, next);
});

router.get("/login", async (ctx) => {
  if (!ctx.isAuthenticated()) {
    ctx.type = "html";
    ctx.body = fs.createReadStream("./src/views/login.html");
  } else {
    ctx.redirect("/status");
  }
});

router.post("/login", async (ctx, next) => {
  return passport.authenticate("local", (err: any, user, info) => {
    failureFlash: "Invalid username or password."
    if (user) {
      ctx.login(user, (err: any) => {
        if (err) {
          ctx.body = { info };
          return next();
        }
      });
      return ctx.body = { authenticated: true, user: { email: user.email, id: user.id, username: user.username } };
    } else if (err) {
      ctx.body = { ...info }
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
    ctx.body = { success: true }
    ctx.throw(200)
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
});

export default router;
