import Router from "koa-router";
import { HTTPCodes } from "../types/HttpCodes.enum.js";
import { container } from "../container.js";
import { UserOptionsService } from "./userOptions.service.js";

const optionsService = container.get(UserOptionsService);
const router = new Router({
  prefix: "/options",
});

router.get("/", async (ctx, next) => {
  if (ctx.state.user) {
    const res = await optionsService.getUserOptions(ctx.state.user.id);
    if (res) {
      ctx.body = res;
      ctx.status = HTTPCodes.OK;
    }
    if (!res) {
      ctx.status = HTTPCodes.SERVER_ERROR;
      ctx.body = {
        error: "Error getting user options",
      };
      ctx.message = "Error getting user options";
    }
  }
  await next();
});

router.post("/", async (ctx, next) => {
  if (ctx.state.user) {
    const userId: string = ctx.state.user.id;
    const params: UserOptionsInput = ctx.params as any;
    const updateOptions = await optionsService.updateOptions(userId, params);
    if (updateOptions) {
      ctx.body = updateOptions;
      ctx.status = HTTPCodes.OK;
    }
    if (!updateOptions) {
      ctx.status = HTTPCodes.SERVER_ERROR;
      ctx.body = {
        error: "Error updating user options",
      };
      ctx.message = "Error updating user options";
    }
  }
  await next();
});

export default router;
