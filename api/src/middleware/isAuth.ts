import jwt from "jsonwebtoken"
import { MiddlewareFn } from "type-graphql";
import { __secretKey__ } from "../constants";
import { MyContext } from "../types";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.ctx.state.user) {
    throw new Error("not authenticated")

  }

  return next()
}

export async function generateToken(data: Object) {
  return jwt.sign(data, __secretKey__)

}