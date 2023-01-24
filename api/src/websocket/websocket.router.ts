import { container } from "../container"
import { GroupService } from "../group/group.service"
import { validateSessionToken } from "../middleware/websocketIsAuth.middleware"
import { MiddlewareContext } from "koa-websocket"
import { RedisKeys } from "../common/redis.service"
import IORedis from "ioredis"
import { ConfigService } from "../common/config.service"
import { GroupWSMessageTypes } from "../types/GroupMessages.enum"
import { IGroup, IGroupWsRequest, IGroupWsResponse } from "../types/Group"
import { GroupWsService } from "../group/groupWs.service"

const groupService = container.get(GroupService)
const groupWsService = container.get(GroupWsService)
const config = container.get(ConfigService).redisConfig



export async function GroupWebsocket(ctx: MiddlewareContext<{}>) {
  const sub = new IORedis({
    host: config.host
  })

  try {
    let redisKey = ""
    let group: IGroup | null = null
    let userId: string | null
    let subbed = false

    const subToGroup = async () => {
      if (subbed === false && group) {
        await groupWsService.groupSub(group, sub)
        subbed = true
      }
    }

    ctx.websocket.on('open', () => {
      const messageRes: IGroupWsResponse = {
        messageType: GroupWSMessageTypes.Open,
      }
      ctx.websocket.send(JSON.stringify(messageRes))
    })
    ctx.websocket.on('close', async () => {
      if (userId && group) {
        await groupService.removeMember(group, userId)
      }
    })

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



      const { group: groupRes } = await groupService.getGroup(groupId, user?.id)

      redisKey = `${RedisKeys.GROUP}-${groupId}`
      group = groupRes

      if (subbed === false) {
        await subToGroup()
      }

      if (valid && user) {
        switch (parsed.messageType) {
          case GroupWSMessageTypes.Open:
            userId = user.id
            if (valid && groupRes) {
              groupWsService.openWsConnection(groupRes)
            }
            break
          default:
            console.log(`unhandled message type: ${parsed.messageType}`)
            break
        }
      }
      if (!valid) {
        ctx.websocket.close()
      }

    })
  } catch (e) {
    console.error(e)
  }

}