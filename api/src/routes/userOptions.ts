// import Router from "koa-router";
// // import queries from "../db/queries/options"

// import db from "../db";
// import { addUserOptions, checkIfOptionsExist, getOptionsByUUID } from "../db/controllers/UserOptions"
// import { ParameterizedContext } from "koa";

// const { userOptionsTable } = db.models.userOptions
// const router = new Router();

// //current route is /api/v1/options
// router.prefix(`/api/v1/${userOptionsTable}`)


// router.get(`/:uuid`, async (ctx: ParameterizedContext) => {
//   await getOptionsByUUID(ctx.params.uuid).then(res => {
//     ctx.body = res
//     ctx.status = 200
//   }).catch(e => {
//     ctx.throw(404, e)
//   })
// })
// router.post(`/:uuid`, async (ctx: ParameterizedContext) => {
//   const { uuid } = ctx.params
//   if (await checkIfOptionsExist(uuid)) {
//     ctx.throw(422, "Error - This user Options object already exists")
//   } else {
//     await addUserOptions(ctx.params.uuid)
//       .then(res => {
//         ctx.body = res
//         ctx.status = 200
//       })
//       .catch(e =>
//         ctx.throw(422, e)
//       )
//   }

// })



// export default router;