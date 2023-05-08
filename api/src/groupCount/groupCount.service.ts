import { addToContainer } from "../container";
import { GroupService } from "../group/group.service";
import { GroupWsService } from "../group/groupWs.service";
import { PlayerService } from "../player/player.service";
import { RollUtilities } from "../roll/roll.utilities";


@addToContainer()
export class GroupCountService {
  constructor(
    private groupService: GroupService,
    private playerService: PlayerService,
    private groupWs: GroupWsService,
    private rollUtilities: RollUtilities
  ) { }

  async getGroupPlayerCounts(groupId: string) {
    const groupRes = await this.groupService.getGroup(groupId)
    const players = await this.playerService.getPlayersByGroupId(groupId)
    if(players && groupRes.group){
      const res = this.rollUtilities.playerCounts(players, groupRes.group.rollType)
      await this.messageIfTooManyLocked(groupId, res)
      return res
    }
    return null
  }

  async messageIfTooManyLocked(groupId: string, playerCounts: PlayerCounts) {
    if (playerCounts.locked > 5) {
      this.groupWs.tooManyLocked(groupId, playerCounts.locked)
    }
  }

  async updateActiveGroupCounts(groupId: string) {
    const groupCounts = await this.getGroupPlayerCounts(groupId)
    if (groupCounts) {
      await this.messageIfTooManyLocked(groupId, groupCounts)
      await this.groupWs.updateGroupCount(groupId, groupCounts)
    }
  }
}