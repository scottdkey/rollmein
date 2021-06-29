import Router from "koa-router";
import { login, logout, me, register, UserResponse } from "../db/controllers/Users";
const router = new Router();

//current prefix is /api/v1/users
router.prefix(`/user`)

router.get(`/me`, async (ctx) => { await me(ctx) });

router.post("/register", async (ctx, next) => {
  const { username, email, password } = ctx.params.input
  const res: UserResponse = await register({ username, email, password })
  if (res.user) {
    ctx.session!.userId = res.user.id
  }
  ctx.body = res
  next()
});

router.post("/login", async (ctx, next) => {
  const input = ctx.params.input
  const res = await login(input)
  if (res.user) {
    ctx.session!.userId = res.user.id
  }
  ctx.body = res
  next()

});

router.get("/logout", async (ctx, next) => { await logout(ctx, next) });

//   ctx.body = `Delete User ${uuid}`
// });
// router.patch(`/:uuid`, async (ctx: ParameterizedContext) => { ctx.body = `Patch user ${ctx.params.uuid}` })

// export default router;
