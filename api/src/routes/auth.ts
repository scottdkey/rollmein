import Router from "koa-router";
import passport from "koa-passport";
import fs from "fs";
import queries from "../db/queries/users.js";
import { Context, DefaultState } from "koa";

const router = new Router<DefaultState, Context>();

router.get("/auth/status", async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.type = "html";
    ctx.body = fs.createReadStream("./src/views/status.html");
  } else {
    ctx.redirect("/auth/login");
  }
});

router.get("/register", async (ctx) => {
  ctx.type = "html";
  ctx.body = fs.createReadStream("./src/views/register.html");
  if (ctx.isAuthenticated()) {
    ctx.redirect("/auth/status");
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
        return ctx.redirect("/auth/status");
      });
    }
    if (err) {
      ctx.body = { info };
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
    ctx.redirect("/auth/status");
  }
});

router.post("/login", async (ctx, next) => {
  return passport.authenticate("local", (err: any, user, info) => {
    if (user) {
      ctx.login(user, (err: any) => {
        if (err) {
          return next();
        }
        return ctx.redirect("/auth/status");
      });
    }
    if (err) {
      ctx.body = { info };
      return next();
    } else {
      return ctx.redirect("/login");
    }
  })(ctx, next);
});

router.get("/logout", async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
    ctx.redirect("/login");
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
});

export default router;
