import { DefaultContext, Next, ParameterizedContext } from "koa"
import passport from "koa-passport";
import { addLastLoginTimeStamp } from "./Users";

type authStatus = {
  id: string | null,
  error: string | null
}

export const checkAuthStatus = async (ctx: DefaultContext): Promise<authStatus> => {
  if (ctx.isAuthenticated()) {
    return {
      id: ctx.state.user.id,
      error: null
    }
  } else {
    return {
      id: null,
      error: "Not Authorized"
    }
  }
}

export const Me = async (ctx: ParameterizedContext): Promise<ParameterizedContext> => {
  const status = await checkAuthStatus(ctx)
  if (status.id) {
    ctx.type = "html";
    ctx.body = status.id
  } else {
    ctx.error = "Not Authenticated"
    ctx.status = 401
  }
  return ctx
}

export const Login = async (ctx: ParameterizedContext, next: Next): Promise<ParameterizedContext> => {
  return passport.authenticate("local", async (err: Error, user, info) => {
    if (user) {
      ctx.login(user, (err: Error) => {
        if (err) {
          ctx.body = { info };
          return next();
        } else {
          return next()
        }
      });
      user = await addLastLoginTimeStamp(user.id)
      return ctx.body = user.id;
    } else if (err) {
      ctx.body = { ...info }
      ctx.redirect("/login")
    }
    else {
      ctx.redirect("/login")
      return ctx.logout();

    }
  })(ctx, next);
}
export const Logout = async (ctx: ParameterizedContext): Promise<ParameterizedContext> => {
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
