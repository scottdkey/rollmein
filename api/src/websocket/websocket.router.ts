import Router from "koa-router"
import { container } from "../container"
import { GroupService } from "../group/group.service"
import { validateSessionToken } from "../middleware/websocketIsAuth.middleware"
import { MiddlewareContext } from "koa-websocket"
import { RedisKeys } from "../common/redis.service"
import IORedis from "ioredis"
import { ConfigService } from "../common/config.service"


const router = new Router()
const groupService = container.get(GroupService)
const config = container.get(ConfigService).redisConfig



export async function GroupWebsocket(ctx: MiddlewareContext<{}>) {
  const sub = new IORedis({
    host: config.host
  })
  ctx.websocket.on('open', () => {
    ctx.websocket.send(JSON.stringify({ group: null, auth: false }))
  })
  try {
    let redisKey = ""
    let group: IGroup | null = null
    let subbed = false

    const subToGroup = async () => {
      if (subbed === false && group) {
        await groupService.groupSub(group, sub)
        subbed = true
      }
    }

    sub.on('message', (channel, message) => {
      if (channel === redisKey) {
        ctx.websocket.send(message)
      }
    })

    ctx.websocket.on("message", async (message: string) => {
      const parsed = JSON.parse(message) as IGroupWsRequest
      const groupId = parsed.groupId

      const token = parsed.sessionToken
      const { user, valid } = await validateSessionToken(token)
      const { data: groupRes } = await groupService.getGroup(groupId, user?.id)

      redisKey = `${RedisKeys.GROUP}-${groupId}`
      group = groupRes.data
      await subToGroup()



      if (valid && groupRes.data) {
        groupService.groupPub({
          group: groupRes.data
        })

      }
      if (!valid) {
        ctx.websocket.close()
      }

    })
  } catch (e) {
    console.error(e)
  }

}



export default router