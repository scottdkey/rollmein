import Router from "koa-router";
import keys from "../config"
import { getAllUsers } from "../db/controllers/Users"

const router = new Router();

const BASE_URL = `${keys.BASE_URL}/users`;

router.get(`${BASE_URL}`, async (ctx) => { await getAllUsers() });

export default router;
