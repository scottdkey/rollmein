import { PlayerService } from './player.service';
import { container } from '../container';
import Router from "koa-router";
import { isAuth } from "../middleware/isAuth";
import { HandleDataResponse } from "../context";
import { MyContext } from '../types/Context';
import { DataResponse } from '../types/DataResponse';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { Player } from '../types/Player';

const router = new Router({ prefix: '/player' })
const playerService = container.get(PlayerService)

router.get('/:groupId', isAuth, async (ctx: MyContext<unknown, DataResponse<Player[]> | null>, next) => {
    const res = await playerService.getPlayersByGroupId(ctx.params.groupId)
    const { body, status } = HandleDataResponse(res, HTTPCodes.OK)
    ctx.body = body
    ctx.status = status
    await next()
})
router.get('/:playerId', isAuth, async (ctx: MyContext<unknown, DataResponse<Player> | null>, next) => {
    const res = await playerService.getPlayerById(ctx.params.playerId)
    const { body, status } = HandleDataResponse(res, HTTPCodes.OK)
    ctx.body = body
    ctx.status = status
    await next()
})


export default router








