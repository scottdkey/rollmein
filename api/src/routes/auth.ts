// import { Context, DefaultState, ParameterizedContext } from "koa";
// import Router from "koa-router";
// import Auth from "../db/controllers/Auth"
// import { addUser } from "../db/controllers/Users";


// const router = new Router<DefaultState, Context>();

// router.prefix(`/api/v1/auth`)

// router.get(`/status`, async (ctx: ParameterizedContext) => { await Auth.Status(ctx) });

// router.post("/register", async (ctx: ParameterizedContext, next) => {
//   ctx = await addUser(ctx)
//   await Auth.Login(ctx, next)
// });

// router.post("/login", async (ctx, next) => { await Auth.Login(ctx, next) });

// router.get("/logout", async (ctx) => { await Auth.Logout(ctx) });

// export default router;
