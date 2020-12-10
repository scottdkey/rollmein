import { Context, DefaultState, ParameterizedContext } from "koa";
import Router from "koa-router";
import {
  AuthStatus,
  LoginUser,
  LogoutUser
} from "../db/controllers/Auth"
import keys from "../config/keys"
import { addUser } from "../db/controllers/Users";

const router = new Router<DefaultState, Context>();

router.prefix(`/api/v1/auth`)

router.get(`/status`, async (ctx: ParameterizedContext) => { await AuthStatus(ctx) });

router.post("/register", async (ctx: ParameterizedContext, next) => {
  ctx = await addUser(ctx)

  await LoginUser(ctx, next)
});

router.post("/login", async (ctx, next) => { await LoginUser(ctx, next) });

router.get("/logout", async (ctx) => { await LogoutUser(ctx) });

export default router;
