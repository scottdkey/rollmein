import { ErrorTypes } from '../types/ErrorCodes.enum';
import { DataResponse } from '../types/DataResponse';
import { addToContainer } from "../container";
import {PlayerCounts, ValidRoll} from "../types/roll";

@addToContainer()
export class RollService {

  lockedCount(players: Player[]): number {
    return players.filter(p => p.inTheRoll).length
  }

  inCount(players: Player[]): number {
    return players.filter(p => p.inTheRoll).length
  }

  playerCounts = (players: Player[], rollType: RollType): PlayerCounts => {
    const locked = players.filter(p => p.locked).length
    const inTheRoll = players.filter(p => p.inTheRoll)
    if (rollType === RollType.ROLE) {
      const tanks = inTheRoll.filter(p => p.tank).length
      const healers = inTheRoll.filter(p => p.healer).length
      const dps = inTheRoll.filter(p => p.dps).length
      return {
        locked,
        inTheRoll: inTheRoll.length,
        tanks,
        healers,
        dps
      }
    } else {
      return {
        locked,
        inTheRoll: inTheRoll.length,
        tanks: 0,
        healers: 0,
        dps: 0
      }
    }
  };

  protected FFARoll(currentGroup: Player[]): { players: Player[]; remaining: Player[] } {
    let remaining = currentGroup
    const players: Player[] = []
    while (players.length > 5) {
      const pickedPlayer = this.rollWithLocked(remaining)
      players.push(pickedPlayer)
      remaining = this.removeFromGroup(pickedPlayer, remaining)
    }
    return { players, remaining }
  }

  rollByRole(currentGroup: Player[]): DataResponse<{
    players: {
      tank: Player;
      healer: Player;
      dps: Player[];
    };
    remaining: Player[];
  }> {
    const validRoll = this.validRoll(currentGroup, RollType.ROLE)
    if (!validRoll.valid) {
      return {
        data: null,
        success: false,
        error: {
          type: ErrorTypes.INVALID_ROLL,
          message: validRoll.errors.join()
        }
      }
    }
    const tankRoll = this.rollForRole(PlayerRoles.TANK, currentGroup);
    const healerRoll = this.rollForRole(PlayerRoles.HEALER, tankRoll.remaining);
    const dpsRoll = this.rollForDps(healerRoll.remaining);
    const players = { tank: tankRoll.player, healer: healerRoll.player, dps: dpsRoll.players }
    return {
      data: { players, remaining: dpsRoll.remaining },
      success: true,
      error: null
    };
  }


  protected randomFromArray(players: Player[]): Player {
    return players[Math.floor(Math.random() * players.length)];
  }
  private removeFromGroup(
    pickedPlayer: Player,
    remainingPlayers: Player[]
  ): Player[] {
    return remainingPlayers.filter(
      (player) => player.id !== pickedPlayer.id
    );
  }

  private rollForRole(role: string, players: Player[]): { player: Player, remaining: Player[] } {
    const group: Player[] = players.filter(
      (player) => player[role as keyof Player] === true
    );
    const playerWithRole = this.rollWithLocked(group)
    const remaining = this.removeFromGroup(playerWithRole, players)

    return {
      player: playerWithRole,
      remaining
    }
  }

  protected rollWithLocked(players: Player[]): Player {
    const locked = players.filter((p: Player) => p.locked);
    const outGroup = players.filter((p: Player) => !p.locked)
    let pickedPlayer: Player;
    if (locked.length > 0) {
      pickedPlayer = this.randomFromArray(locked);
    } else {
      pickedPlayer = this.randomFromArray(outGroup);
    }
    return pickedPlayer
  }

  private rollForDps(currentGroup: Player[]): { remaining: Player[], players: Player[] } {
    let remaining = currentGroup;

    const players: Player[] = [];
    for (let dpsCount = 1; dpsCount < 4; dpsCount++) {
      const pickedDPS = this.rollForRole(PlayerRoles.DPS, remaining);
      players.push(pickedDPS.player);
      remaining = pickedDPS.remaining;
    }
    return { remaining, players };
  }

  protected createError(type: string, message: string): AppError {
    return {
      type,
      message
    }
  }

  private validRoll = (players: Player[], rollType: RollType): ValidRoll => {
    const playerCounts = this.playerCounts(players, rollType)
    const errorArray: AppError[] = []
    const invalidRollError = (message: string) => {
      errorArray.push(this.createError("invalidRoll", message))
    }
    const isRoleBased = rollType === RollType.ROLE
    if (isRoleBased && playerCounts.tanks === 0) {
      invalidRollError("must have a tank")

    }
    if (isRoleBased && playerCounts.dps >= 3) {
      invalidRollError("must have at least 3 dps")

    }
    if (isRoleBased && playerCounts.healers === 0) {
      invalidRollError("must have a healer")

    }
    if (playerCounts.inTheRoll > 5) {
      invalidRollError("must have more than 5 players")
    }
    return {
      valid: errorArray.length < 1,
      errors: errorArray
    }
  }

}

export enum RollType {
  FFA = "ffa",
  ROLE = 'role'
}
export enum PlayerRoles {
  TANK = 'tank',
  DPS = 'dps',
  HEALER = 'healer'
}
