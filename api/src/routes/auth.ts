import { Context, DefaultState } from "koa";
import Router from "koa-router";
import {
  AuthStatus,
  RegisterHTMLStream,
  RegisterUser,
  LoginUserHTMLStream,
  LoginUser,
  LogoutUser
} from "../db/controllers/Auth"
import keys from "../config"
import { addUser } from "../db/controllers/Users";

const router = new Router<DefaultState, Context>();

router.prefix(`${keys.BASE_URL}/auth`)

router.get(`/status`, async (ctx) => { await AuthStatus(ctx) });

router.get("/register", async (ctx) => { await RegisterHTMLStream(ctx) });

router.post("/register", async (ctx, next) => {
  console.log("register hit")
  await addUser(ctx)
  // await RegisterUser(ctx, next)
});

router.get("/login", async (ctx) => { await LoginUserHTMLStream(ctx) });

router.post("/login", async (ctx, next) => { await LoginUser(ctx, next) });

router.get("/logout", async (ctx) => { await LogoutUser(ctx) });

export default router;
