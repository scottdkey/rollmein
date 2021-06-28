import Router from "koa-router";
import { login, logout, me, register, UserResponse } from "../db/controllers/Users";
const router = new Router();

//current prefix is /api/v1/users
router.prefix(`/user`)

router.get(`/me`, async (ctx) => { await me(ctx) });

router.post("/register", async (ctx, next) => {
  const { username, email, password } = ctx.request.body.options
  const res: UserResponse = await register({ username, email, password })
  if (res.user) {
    ctx.session!.userId = res.user.id
  }
  ctx.body = res
  next()
});

router.post("/login", async (ctx, next) => {
  const { userNameOrEmail, password } = ctx.request.body.options
  const res = await login({ userNameOrEmail, password })
  if (res.user) {
    ctx.session!.userId = res.user.id
  }
  ctx.body = res
  next()

});

router.get("/logout", async (ctx, next) => { await logout(ctx, next) });

export default router;
