import { addToContainer } from "../container.js";
import { GroupService } from "../group/group.service.js";
import { PlayerService } from "../player/player.service.js";
import { RollUtilities } from "../roll/roll.utilities.js";
import { SocketService } from "../socket/socket.service.js";

@addToContainer()
export class GroupCountService {
  constructor(
    private groupService: GroupService,
    private playerService: PlayerService,
    private socket: SocketService,
    private rollUtilities: RollUtilities
  ) {}

  async getGroupPlayerCounts(groupId: string) {
    const groupRes = await this.groupService.getGroup(groupId);
    const players = await this.playerService.getPlayersByGroupId(groupId);
    if (players && groupRes.group) {
      const res = this.rollUtilities.playerCounts(
        players,
        groupRes.group.rollType
      );
      await this.messageIfTooManyLocked(groupId, res);
      return res;
    }
    return null;
  }

  async messageIfTooManyLocked(groupId: string, playerCounts: PlayerCounts) {
    if (playerCounts.locked > 5) {
      this.socket.io.emit(`/group/${groupId}/counts`, playerCounts);
    }
  }

  async updateActiveGroupCounts(groupId: string) {
    const groupCounts = await this.getGroupPlayerCounts(groupId);
    if (groupCounts) {
      await this.messageIfTooManyLocked(groupId, groupCounts);
      await this.socket.io.emit(`/group/${groupId}/counts`, groupCounts);
    }
  }
}
