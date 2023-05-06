import { addToContainer } from "../container";
import { LoggerService } from "../logger/logger.service";
import { PlayerService } from "../player/player.service";
import { RollService } from "../roll/roll.service";
import { GroupService } from "../group/group.service";
import { GroupWsService } from "../group/groupWs.service";
import { inject } from "inversify";


@addToContainer()
export class GroupCountService {
  private logger = this.ls.getLogger(GroupCountService.name)
  constructor(
    private groupService: GroupService,
    private playerService: PlayerService,
    private rollService: RollService,
    private groupWs: GroupWsService,
    private ls: LoggerService
  ) { }

  async getGroupPlayerCounts(groupId: string) {
    try {
      const group = await this.groupService.getGroup(groupId)
      const players = await this.playerService.getPlayersByGroupId(groupId)
      if (players.data && group.group?.rollType) {

        const res = this.rollService.playerCounts(players.data, group.group.rollType)
        if (res.locked > 5) {
          this.groupWs.tooManyLocked(groupId, res.locked)
        }
        return res
      }
      return null
    } catch (e) {
      this.logger.error({ message: "getGroupPlayerCounts error", error: e })
      return null
    }

  }
  async updateActiveGroupCounts(groupId: string) {
    console.log({ groupId })
    try {
      const groupCounts = await this.getGroupPlayerCounts(groupId)
      if (groupCounts) {
        await this.groupWs.updateGroupCount(groupId, groupCounts)
      }
    } catch (e) {
      this.logger.error({ message: "updateActiveGroupCounts error", error: e })
    }
  }
}