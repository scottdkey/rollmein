import { ParameterizedContext } from "koa";
import Router from "koa-router";
import { container } from "../container";
import { UserOptionsService } from "./userOptions.service";
import { HTTPCodes } from "../../../web/src/types/HttpCodes.enum";
import { UserOptionsInput } from "../../../web/src/types/UserOptions";

const optionsService = container.get(UserOptionsService);
const router = new Router({
  prefix: "/options",
});

router.get("/", async (ctx: ParameterizedContext, next) => {
  if (ctx.state.user) {
    const res = await optionsService.getUserOptions(ctx.state.user.id);
    if (res) {
      ctx.body = res;
      ctx.status = HTTPCodes.OK;
    }
    if (!res) {
      ctx.status = HTTPCodes.INTERNAL_SERVER_ERROR;
      ctx.body = {
        error: "Error getting user options",
      };
      ctx.message = "Error getting user options";
    }
  }
  await next();
});

router.post("/", async (ctx: ParameterizedContext, next) => {
  if (ctx.state.user) {
    const userId: string = ctx.state.user.id;
    const params: UserOptionsInput = ctx.params;
    const updateOptions = await optionsService.updateOptions(userId, params);
    if (updateOptions) {
      ctx.body = updateOptions;
      ctx.status = HTTPCodes.OK;
    }
    if (!updateOptions) {
      ctx.status = HTTPCodes.INTERNAL_SERVER_ERROR;
      ctx.body = {
        error: "Error updating user options",
      };
      ctx.message = "Error updating user options";
    }
  }
  await next();
});

export default router;
