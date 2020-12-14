import Router from "koa-router";
import { DefaultContext, ParameterizedContext } from "koa"
import keys from "../config/keys"
import { userTable } from "../db/models/user";
import { addUser, getAllUsers, getUserByUUID } from "../db/controllers/Users";


const router = new Router();

//current prefix is /api/v1/users
router.prefix(`/api/v1/${userTable}`)

router.get(`/`, async (ctx: DefaultContext) => {
  ctx.body = await getAllUsers()
});

router.get(`/:uuid`, async (ctx: ParameterizedContext) => {
  const { uuid } = ctx.params
  ctx.body = await getUserByUUID(uuid)
});

router.post(`/`, async (ctx: ParameterizedContext) => {
  await addUser(ctx).then(res => ctx = res).catch(e => ctx.throw(401, "Error unable to create user", e))
});

router.delete(`/:uuid`, async (ctx: ParameterizedContext) => {
  const { uuid } = ctx.params
  ctx.body = `Delete User ${uuid}`
});
router.patch(`/:uuid`, async (ctx: ParameterizedContext) => { ctx.body = `Patch user ${ctx.params.uuid}` })

export default router;
