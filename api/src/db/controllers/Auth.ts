import { DefaultContext, Next, ParameterizedContext } from "koa"
import passport from "koa-passport";
import { addLastLoginTimeStamp } from "./Users";

const Status = async (ctx: DefaultContext) => {
  if (ctx.isAuthenticated()) {
    ctx.type = "html";
    const { user } = ctx.state
    ctx.body = user
  } else {
    ctx.body = "Not Authenticated"
    ctx.status = 401
  }
}

const Login = async (ctx: ParameterizedContext, next: Next) => {
  return passport.authenticate("local", async (err: any, user, info) => {
    if (user) {
      ctx.login(user, (err: any) => {
        if (err) {
          ctx.body = { info };
          return next();
        }
      });
      user = await addLastLoginTimeStamp(user.id)
      return ctx.body = user;
    } else if (err) {
      ctx.body = { ...info }
    }
    else {
      return ctx.logout();
    }
  })(ctx, next);
}
const Logout = async (ctx: ParameterizedContext) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
    ctx.redirect("/login");
    ctx.body = { success: true }
    ctx.throw(200)
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
}

export default {
  Status,
  Login,
  Logout
}