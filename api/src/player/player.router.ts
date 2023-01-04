import { PlayerService } from './player.service';
import { container } from '../container';
import Router from "koa-router";
import { MyContext } from '../types/Context';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { IUpdatePlayer, Player } from '../types/Player';
import { Next } from 'koa';
import { RequireAuth } from '../middleware/requireAuth.middleware';

const router = new Router({ prefix: '/player' })
const playerService = container.get(PlayerService)

// router.get('/:groupId', isAuth, async (ctx: MyContext<unknown, DataResponse<Player[]> | null>, next) => {
//     const res = await playerService.getPlayersByGroupId(ctx.params.groupId)
//     const { body, status } = HandleDataResponse(res, HTTPCodes.OK)
//     ctx.body = body
//     ctx.status = status
//     await next()
// })
router.get('/:playerId', RequireAuth, async (ctx: MyContext<unknown, Player | null>, next) => {
    try {
        console.log(ctx.params.playerId)
        if(ctx.params.playerId){
            const res = await playerService.getPlayerById(ctx.params.playerId)
            ctx.body = res
            ctx.status = HTTPCodes.OK
            
        }
        await next()
    } catch (e) {
        ctx.body = e.message
        ctx.status = HTTPCodes.SERVER_ERROR
    }
})

router.put("/", RequireAuth, async (ctx: MyContext<IUpdatePlayer, Player | null>, next: Next) => {
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




export default router








