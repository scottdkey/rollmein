import { Next } from "koa";
import Router from "koa-router";

import { container } from "../container.js";
import { GroupService } from "./group.service.js";

import { RequireAuth } from "../middleware/requireAuth.middleware.js";
import { LoggerService } from "../logger/logger.service.js";
import { GroupCountService } from "../groupCount/groupCount.service.js";
import { createError } from "../utils/CreateError.js";
import { ICreateGroup, IGroup, IUpdateGroup } from "../types/Group.js";
import { ErrorTypes } from "../types/ErrorCodes.enum.js";
import { ErrorMessages } from "../types/ErrorTypes.enum.js";
import { HTTPCodes } from "../types/HttpCodes.enum.js";
import { CreatePlayerValidation } from "../player/validation/CreatePlayer.validation.js";
import { z } from "zod";

const groupRouter = new Router({ prefix: "/group" });
const groupService = container.get(GroupService);
const groupCountService = container.get(GroupCountService);
const logger = container.get(LoggerService).getLogger("groupRouter");

groupRouter.get("/", async (ctx, next: Next) => {
  try {
    let returnGroups: IGroup[] = [];
    const user = ctx.state.user;
    if (user) {
      const groups = await groupService.getGroupsByUserId(user.id);
      returnGroups = groups ? [...returnGroups, ...groups] : [];
    }
    const groups = await groupService.getGroups();
    returnGroups = groups ? [...returnGroups, ...groups] : [];

    ctx.body = [...new Set(returnGroups)];
    ctx.status = HTTPCodes.OK;
  } catch (e) {
    ctx.status = HTTPCodes.SERVER_ERROR;
    ctx.body = e;
  }

  await next();
});

groupRouter.get("/:groupId", async (ctx, next: Next) => {
  try {
    const userId = ctx.state.user?.id;
    const groupId = ctx.params.groupId;
    if (groupId !== "undefined") {
      const { group } = await groupService.getGroup(groupId, userId);
      if (group) {
        ctx.body = {
          group,
          error: null,
        };
        ctx.status = HTTPCodes.OK;
      }
    } else {
      ctx.status = HTTPCodes.NOT_FOUND;
      ctx.body = {
        group: null,
        error: {
          message: ErrorMessages.GroupNotFound,
          type: ErrorTypes.NOT_FOUND,
          context: "group router get group by id",
          detail: "group id is undefined",
        },
      };
    }
  } catch (e) {
    ctx.status = e.status;
    ctx.body = {
      group: null,
      error: {
        message: ErrorMessages.GroupNotFound,
        type: ErrorTypes.NOT_FOUND,
        context: "group router get group by id",
        detail: e.message,
      },
    };
  }

  await next();
});

groupRouter.post("/", RequireAuth, async (ctx, next: Next) => {
  try {
    const userId = ctx.state.user?.id;
    const validUser = ctx.state.validUser;
    const body = ctx.request.body as ICreateGroup;
    if (userId && validUser) {
      const group = await groupService.createGroup(ctx.state.user.id, body);
      if (group) {
        ctx.body = group;
        ctx.status = HTTPCodes.CREATED;
      }
      if (!group) {
        ctx.throw(HTTPCodes.UNPROCESSABLE_ENTITY, "group not created");
      }
    }
    if (!userId || !validUser) {
      ctx.throw(HTTPCodes.NOT_AUTHORIZED, "not signed in, cannot create group");
    }
  } catch (e) {
    ctx.throw(HTTPCodes.SERVER_ERROR, e);
  }
  await next();
});

groupRouter.put("/", RequireAuth, async (ctx, next: Next) => {
  try {
    const userId = ctx.state.user?.id;
    const body = ctx.request.body as IUpdateGroup;
    console.log({ body, userId });
    if (userId && ctx.state.validUser) {
      const group = await groupService.updateGroup(userId, body);
      if (group) {
        ctx.body = group;
        ctx.status = HTTPCodes.OK;
      }
      if (!group) {
        createError({
          message: "group not updated",
          type: ErrorTypes.GROUP_ERROR,
          context: "group router update group",
          status: HTTPCodes.UNPROCESSABLE_ENTITY,
        });
      }
    }
  } catch (e) {
    logger.error(e);
    ctx.body = e;
    ctx.status = HTTPCodes.SERVER_ERROR;
  }

  await next();
});

groupRouter.delete("/", RequireAuth, async (ctx, next: Next) => {
  ctx.body = {
    message: "received",
  };

  await next();
});

groupRouter.post("/addPlayer", RequireAuth, async (ctx, next: Next) => {
  try {
    logger.info(ctx.request.body);
    const body: ICreatePlayer = CreatePlayerValidation.parse(ctx.request.body);
    const groupId = body.groupId;
    const userId = ctx.state.user.id;
    if (groupId && userId && body) {
      const player = await groupService.createGroupPlayer(
        body,
        groupId,
        userId
      );
      ctx.body = {
        player,
        error: null,
      };
      ctx.status = HTTPCodes.OK;
    }

    if (groupId === "" || groupId === null || groupId === undefined) {
      ctx.status = HTTPCodes.UNPROCESSABLE_ENTITY;
      ctx.body = {
        player: null,
        error: {
          message: ErrorMessages.GroupNotFound,
          type: ErrorTypes.NOT_FOUND,
          context: "group router add player",
          detail: "group id is undefined",
        },
      };
    }
  } catch (e) {
    logger.error(
      {
        body: ctx.request.body,
        error: JSON.parse(e.message),
      },
      "unable to add player to group"
    );
    ctx.body = e.message;
    ctx.status = e.status;
  }
  await next();
});

groupRouter.post("/joinGroup", RequireAuth, async (ctx, next: Next) => {
  const userId = ctx.state.user.id as string;
  const body = z
    .object({
      groupId: z.string().uuid().optional(),
    })
    .parse(ctx.request.body);

  if (body && body.groupId) {
    await groupService.userJoinGroup(body.groupId, userId);
    ctx.status = HTTPCodes.OK;
    ctx.body = {
      success: true,
    };
  }
  if (body.groupId === undefined) {
    ctx.status = HTTPCodes.BAD_REQUEST;
    ctx.message = "must include a group id on this request";
  }

  await next();
});

groupRouter.get("/count/:groupId", async (ctx, next: Next) => {
  const groupId = ctx.params.groupId;
  const groupCounts = await groupCountService.getGroupPlayerCounts(groupId);
  if (groupCounts) {
    ctx.body = groupCounts;
  }
  /**
   * default return
   */
  if (!groupCounts) {
    const playerCounts: PlayerCounts = {
      locked: 0,
      inTheRoll: 0,
      tanks: 0,
      healers: 0,
      dps: 0,
    };
    ctx.message = `group counts with groupId: ${groupId} not found`;
    ctx.body = playerCounts;
  }
  await next();
});

export default groupRouter;
