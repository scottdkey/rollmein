import { Next } from "koa";
import { MiddlewareFn } from "type-graphql";
import {MyContext} from "../types/context";

interface IPlayerRequest {
  groupId: string
}

export async function HasGroupId<T>(ctx: MyContext<T>, next: Next): Promise<MiddlewareFn<MyContext<T>>> {
  if (ctx.state.user && ctx.request.body) {
    const requestData: IPlayerRequest = ctx.request.body
    console.log(requestData)
  }
  return next()
}