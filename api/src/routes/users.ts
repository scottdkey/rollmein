import Router from "koa-router";
import queries from "../db/queries/users.js";
import keys from "../../config"

const router = new Router();

const BASE_URL = `${keys.BASE_URL}/users`;

router.get(`${BASE_URL}`, async (ctx) => {
  try {
    const users = await queries.getAllUsers();
    ctx.body = {
      status: "success",
      data: users,
    };
  } catch (err) {
    ctx.status = 404
    ctx.body = "Error: Request not found"
  }
});

export default router;
