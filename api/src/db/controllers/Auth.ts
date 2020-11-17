import { DefaultContext, Next, ParameterizedContext } from "koa"
import passport from "koa-passport";
import fs from "fs";
import { addUser } from "./Users";

const AuthStatus = async (ctx: DefaultContext) => {
  if (ctx.isAuthenticated()) {
    ctx.type = "html";
    const { user } = ctx.state
    ctx.body = user
  } else {
    ctx.body = "user is not authenticated"
    ctx.status = 401
  }
}
const RegisterHTMLStream = async (ctx: DefaultContext) => {
  ctx.type = "html";
  ctx.body = fs.createReadStream("./src/views/register.html");
  if (ctx.isAuthenticated()) {
    ctx.redirect("/status");
  }
}
const RegisterUser = async (ctx: ParameterizedContext, next: Next) => {
  const user = await addUser(ctx)
  ctx.body = user
  console.log(user)
  // return passport.authenticate("local", (err: any, user, info) => {
  //   if (user) {
  //     res.login(user, (err: any) => {
  //       if (err) {
  //         return next();
  //       } else {
  //         return res.redirect("/api/v1/auth/status");
  //       }
  //     });
  //   }
  //   if (ctx.err) {
  //     res.error = err;
  //     return next();
  //   } else {
  //     return res.redirect("/login");
  //   }
  // })(res, next);
}
const LoginUserHTMLStream = async (ctx: DefaultContext) => {
  if (!ctx.isAuthenticated()) {
    ctx.type = "html";
    ctx.body = fs.createReadStream("./src/views/login.html");
  } else {
    ctx.redirect("/status");
  }
}
const LoginUser = async (ctx: ParameterizedContext, next: Next) => {
  return passport.authenticate("local", (err: any, user, info) => {
    if (user) {
      ctx.login(user, (err: any) => {
        if (err) {
          ctx.body = { info };
          return next();
        }
      });
      return ctx.body = user;
    } else if (err) {
      ctx.body = { ...info }
    }
    else {
      return ctx.logout();
    }
  })(ctx, next);
}
const LogoutUser = async (ctx: ParameterizedContext) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
    // ctx.redirect("/login");
    ctx.body = { success: true }
    ctx.throw(200)
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
}

export {
  AuthStatus,
  RegisterHTMLStream,
  RegisterUser,
  LoginUserHTMLStream,
  LoginUser,
  LogoutUser
}