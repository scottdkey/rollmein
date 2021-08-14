import jwt from "jsonwebtoken"
import { MiddlewareFn } from "type-graphql";
import { __secretKey__ } from "../constants";
import { User } from "../entites/User";
import { MyContext } from "../types";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (context.id) {
    context.ctx.user = async () => await context.em.findOne(User, { id: context.id })
  } else {
    context.ctx.state.user = null
    throw new Error("not authenticated")

  }

  return next()
}

export async function generateToken(data: Object) {
  return jwt.sign(data, __secretKey__)

}