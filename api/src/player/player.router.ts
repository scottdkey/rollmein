import { PlayerService } from './player.service';
import { container } from '../container';
import Router from "koa-router";
import { MyContext } from '../types/Context';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { Next } from 'koa';
import { RequireAuth } from '../middleware/requireAuth.middleware';
import { LoggerService } from '../common/logger.service';

const router = new Router({ prefix: '/player' })
const playerService = container.get(PlayerService)
const logger = container.get(LoggerService).getLogger("playerRouter")

// router.get('/:groupId', isAuth, async (ctx: MyContext<unknown, DataResponse<Player[]> | null>, next) => {
//     const res = await playerService.getPlayersByGroupId(ctx.params.groupId)
//     const { body, status } = HandleDataResponse(res, HTTPCodes.OK)
//     ctx.body = body
//     ctx.status = status
//     await next()
// })
router.get('/:playerId', RequireAuth, async (ctx: MyContext<unknown, IPlayer | null>, next) => {
    try {
        if (ctx.params.playerId) {
            const res = await playerService.getPlayerById(ctx.params.playerId)
            ctx.body = res
            ctx.status = HTTPCodes.OK

        }
        if(!ctx.params.playerId) {
            ctx.throw(HTTPCodes.NOT_FOUND, `no player with id ${ctx.params.playerId}`)
        }
        await next()
    } catch (e) {
        ctx.throw(HTTPCodes.SERVER_ERROR, 'not found')
    }
})

router.put("/", RequireAuth, async (ctx: MyContext<IUpdatePlayer, IPlayer | null>, next: Next) => {
    try {
        const userId = ctx.state.user?.id as string
        const requestBody = ctx.request.body
        const updateRes = await playerService.updatePlayer(requestBody, userId)
        ctx.body = updateRes
        ctx.status = HTTPCodes.OK
        await next()
    } catch (e) {
        ctx.body = e.message
        ctx.status = HTTPCodes.SERVER_ERROR
        await next()
    }
})

router.get("/:userId", RequireAuth, async (ctx: MyContext<{}, IPlayer | null>, next: Next) => {
    const requestUserId = ctx.query.userId as string | undefined
    if (requestUserId) {
        const player = await playerService.getPlayerByUserId(requestUserId)
        if (player) {
            ctx.body = player
        }
        if (!player) {
            const error = {
                message: `unable to find player with userId:${requestUserId}`,
            }
            logger.error(error)
            ctx.throw(HTTPCodes.NOT_FOUND, error)
        }
    }

    await next()

})




export default router








