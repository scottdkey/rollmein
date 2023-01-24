import { Redis } from "ioredis"
import { RedisKeys, RedisService } from "../common/redis.service"
import { IGroup, IGroupWsResponse } from "../types/Group"
import { Logger, LoggerService } from "../common/logger.service"
import { GroupWSMessageTypes } from "../types/GroupMessages.enum"
import { addToContainer } from "../container"


@addToContainer()
export class GroupWsService {
  private logger: Logger
  constructor(private redisService: RedisService, private ls: LoggerService) {
    this.logger = this.ls.getLogger(GroupWsService.name)
  }

  groupPub = async (groupId: string, message: IGroupWsResponse) => {
    await this.redisService.publish(RedisKeys.GROUP, groupId, message)
  }

  async groupUpdated(groupId: string) {
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.GroupUpdated,
      announceMessage: `group settings were updated`,
      refetchQueries: [`group-${groupId}`, `groupCount-${groupId}`]
    })
  }
  async tooManyLocked(groupId: string, count: number) {
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.TooManyLocked,
      announceMessage: `Currently ${count} are locked in the roll, seems like too many`,
    })
  }

  async playerJoinedGroup(groupId: string, playerName: string, playerId: string) {
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.JoinGroup,
      announceMessage: `${playerName} joined the group.`,
      refetchQueries: [`player-${playerId}`, `groupCount-${groupId}`]
    })
  }

  async playerUpdated(groupId: string, playerId: string) {
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.PlayerUpdated,
      refetchQueries: [`player-${playerId}`, `groupCount-${groupId}`]
    })
  }


  async playerLeftGroup(groupId: string, playerName: string) {
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.RemoveMember,
      announceMessage: `${playerName} left the group`,
      refetchQueries: [`group-${groupId}`, `groupCount-${groupId}`]
    })
  }
  async playerWasAdded(groupId: string, playerName: string) {
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.AddPlayer,
      announceMessage: `${playerName} was added to the group`,
      refetchQueries: [`group-${groupId}`, `groupCount-${groupId}`]
    })
  }

  async openWsConnection(group: IGroup) {
    await this.groupPub(group.id, {
      messageType: GroupWSMessageTypes.Open
    })
  }

  groupSub = async (group: IGroup | null, sub: Redis) => {
    if (group) {
      const redisKey = `${RedisKeys.GROUP}-${group.id}`
      const current = await this.redisService.get(RedisKeys.GROUP, group.id)

      if (current.data === null) {
        await this.redisService.set(RedisKeys.GROUP, group.id, group)
      }
      await sub.subscribe(redisKey, (err, count) => {
        if (err) {
          this.logger.error({
            message: `Failed to subscribe: %s ${err.message}`
          })
        } else {
          this.logger.info({
            message:
              `Subscribed successfully! This client is currently subscribed to ${count} channels.`
          });
        }
      })
    }
  }
}
