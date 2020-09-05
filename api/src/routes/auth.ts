import Router from "koa-router";
import passport from "koa-passport";
import fs from "fs";
import queries from "../db/queries/users.js";

const router = new Router();

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
  const user = await queries.addUser(ctx.request.body);
  return passport.authenticate("local", (err, user, info) => {
    if (user) {
      ctx.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/auth/status");
      });
    }
    if (err) {
      ctx.body = { info };
      return next(err);
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
  return passport.authenticate("local", (err, user, info) => {
    if (user) {
      ctx.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/auth/status");
      });
    }
    if (err) {
      ctx.body = { info };
      return next(err);
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
