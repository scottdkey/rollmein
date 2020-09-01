const Router = require("koa-router");
const queries = require("../db/queries/users");

const router = new Router();
const BASE_URL = `${process.env.BASE_API_URL}/users`;

router.get(`${BASE_URL}`, async (ctx) => {
  try {
    const users = await queries.getAllUsers();
    ctx.body = {
      status: "success",
      data: users,
    };
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
