import { EntityManager } from "@mikro-orm/core"
import jwt, {JwtPayload} from "jsonwebtoken"
import { Context } from "koa"
import { __secretKey__ } from "../constants"
import { Options } from "../entites/Options"
import { User } from "../entites/User"


export interface TokenInterface {
  id: string
}


export const signJwt = (userId: String) => jwt.sign({ id: userId }, __secretKey__)
export const verifyJwt = (token: string): JwtPayload | string => jwt.verify(token, __secretKey__) 

export const jwtSetUserOrFail = (ctx: Context, em: EntityManager) => {
  if (ctx.request.headers.authorization !== undefined) {
    const validToken = verifyJwt(ctx.request.headers.authorization) as TokenInterface
    if (validToken) {
      em.findOne(User, validToken.id).then(user =>
        ctx.state.user = { ...user }

      )
      em.findOne(Options, { userId: validToken.id }).then(options => {
        ctx.state.options = options
      })

    }

  }
}