import { Next, ParameterizedContext } from "koa";
import Router from "koa-router";

import { container } from "../container";
import { GroupService } from "./group.service";

import { RequireAuth } from "../common/middleware/requireAuth.middleware";
import { LoggerService } from "../logger/logger.service";
import { GroupCountService } from "../groupCount/groupCount.service";
import { createError } from "../utils/CreateError";
import {
  ICreateGroup,
  IGroup,
  IUpdateGroup,
} from "../../../web/src/types/Group";
import { HTTPCodes } from "../../../web/src/types/HttpCodes.enum";
import { ErrorTypes } from "../../../web/src/types/ErrorCodes.enum";
import { ErrorMessages } from "../../../web/src/types/ErrorTypes.enum";

const groupRouter = new Router({ prefix: "/group" });
const groupService = container.get(GroupService);
const groupCountService = container.get(GroupCountService);
const logger = container.get(LoggerService).getLogger("groupRouter");

groupRouter.get("/", async (ctx: ParameterizedContext, next: Next) => {
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
    ctx.status = HTTPCodes.INTERNAL_SERVER_ERROR;
    ctx.body = e;
  }

  await next();
});

groupRouter.get("/:groupId", async (ctx: ParameterizedContext, next: Next) => {
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

groupRouter.post(
  "/",
  RequireAuth,
  async (ctx: ParameterizedContext, next: Next) => {
    try {
      const userId = ctx.state.user?.id;
      const validUser = ctx.state.validUser;
      const body = ctx.request.body as unknown as ICreateGroup;
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
        ctx.throw(HTTPCodes.UNAUTHORIZED, "not signed in, cannot create group");
      }
    } catch (e) {
      ctx.throw(HTTPCodes.SERVER_ERROR, e);
    }
    await next();
  }
);

groupRouter.put("/", async (ctx: ParameterizedContext, next: Next) => {
  const userId = ctx.state.user?.id;
  try {
    const body = ctx.request.body as unknown as IUpdateGroup;
    if (userId && ctx.state.validUser) {
      const group = await groupService.updateGroup(userId, body);
      if (group) {
        ctx.body = group;
        ctx.status = HTTPCodes.OK;
      }
      if (!group) {
        ctx.body = createError({
          message: "group not updated",
          type: ErrorTypes.GROUP_ERROR,
          context: "group router update group",
        });
        ctx.status = HTTPCodes.UNPROCESSABLE_ENTITY;
      }
    }
  } catch (e) {
    logger.error(e);
    ctx.body = e;
    ctx.status = HTTPCodes.SERVER_ERROR;
  }

  await next();
});

groupRouter.delete("/", async (ctx: ParameterizedContext, next: Next) => {
  ctx.body = {
    message: "received",
  };

  await next();
});

groupRouter.post(
  "/addPlayer",
  RequireAuth,
  async (ctx: ParameterizedContext, next: Next) => {
    const body = ctx.request.body as unknown as ICreatePlayer | undefined;
    const groupId = body?.groupId as string;
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

    if (groupId === "") {
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

    await next();
  }
);

groupRouter.post(
  "/joinGroup",
  RequireAuth,
  async (ctx: ParameterizedContext, next: Next) => {
    const userId = ctx.state.user.id as string;
    const groupId = ctx.request.body?.groupId as string | undefined;
    if (groupId) {
      await groupService.userJoinGroup(groupId, userId);
      ctx.status = HTTPCodes.OK;
      ctx.body = {
        success: true,
      };
    }
    if (groupId === undefined) {
      ctx.throw(
        HTTPCodes.BAD_REQUEST,
        "must include a group id on this request"
      );
    }

    await next();
  }
);

groupRouter.get(
  "/count/:groupId",
  async (ctx: ParameterizedContext, next: Next) => {
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
  }
);

export default groupRouter;
