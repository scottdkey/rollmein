import {PlayerService} from '../services/player.service';
import {container} from '../container';
import Router from "koa-router";
import {isAuth} from "../middleware/isAuth";
import {HandleDataResponse} from "../context";
import {HTTPCodes} from "../types/HttpCodes.enum";
import {MyContext} from "../types/context";


const router = new Router({ prefix: '/player' })
const playerService = container.get(PlayerService)

router.get('/:groupId', isAuth, async(ctx: MyContext<Player[]>, next)=> {
    const res = await playerService.getPlayersByGroupId(ctx.params.groupId)
    const {body, status} = HandleDataResponse(res, HTTPCodes.OK)
    ctx.body = body
    ctx.status = status
    await next()
})
router.get('/:playerId', isAuth, async(ctx:MyContext<Player>, next) => {
    const res = await playerService.getPlayerById(ctx.params.playerId)
    const {body, status } = HandleDataResponse(res, HTTPCodes.OK)
    ctx.body = body
    ctx.status = status
    await next()
})


export default router








