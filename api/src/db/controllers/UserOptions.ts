

// import { ParameterizedContext } from "koa"
// import { UserOptions } from "../../entites/UserOptions"
// import { isAuth } from "./Users"


// interface NewOptions {
//   id: number,
//   rollType: string,
//   lockAfterOut: boolean,
//   theme: string,
//   userId: string
// }

// interface UpdateOptions extends NewOptions {
//   id: number,
// }


// export const getOptions = async (userId: string) => {
//   return await UserOptions.findOne(userId)
// }

// export const addUserOptions = async (ctx: ParameterizedContext) => {
//   if (isAuth(ctx) && ctx.session) {
//     const userId: string = ctx.session.userId
//     const input = ctx.body as UserOptions
//     return await UserOptions.create({
//       ...input, userId
//     }).save()
//   } else {
//     return {
//       errors: {
//         field: "userId",
//         message: "no session found, please sign in"
//       }
//     }
//   }


// }

// export async function updateUserOptions(ctx: ParameterizedContext) {
//   const { id, rollType, lockAfterOut, theme } = ctx.body as UpdateOptions
//   const userOptions = await UserOptions.findOne(id)
//   if (isAuth(ctx)) {
//     return {
//       error: "not authorized"
//     }
//   } else if (!userOptions) {
//     return {
//       error: "submitted empty objet"
//     }

//   }
//   else {
//     return UserOptions.update({ id }, {
//       rollType,
//       lockAfterOut,
//       theme,
//     })

//   }

// }

// export async function deleteUserOptions(id: number, ctx: ParameterizedContext) {
//   if (isAuth(ctx)) {
//     await UserOptions.delete(id)
//     return { delete: true }
//   } else{
//     return {
//       error: "not authorized"
//     }
//   }

// }