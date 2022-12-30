import { NotInDatabaseError, AuthorizationError } from '../utils/errorsHelpers';
import { DatabaseService } from '../common/database.service';
import { addToContainer } from '../container';
import { DataServiceAbstract } from '../common/dataService.abstract';
import { DataResponse } from '../../../types/DataResponse';

@addToContainer()
export class PlayerService extends DataServiceAbstract<DbPlayer, Player>{
  db: DatabaseService
  constructor(db: DatabaseService) {
    super()
    this.db = db
  }

  mapToCamelCase = ({ id, group_id, user_id, name, tank, healer, dps, locked, in_the_roll, created_at, updated_at }: DbPlayer): Player => {
    return {
      id,
      groupId: group_id,
      userId: user_id,
      name,
      tank,
      healer,
      dps,
      locked,
      inTheRoll: in_the_roll,
      createdAt: created_at,
      updatedAt: updated_at
    }
  }

  async getPlayersByGroupId(groupId: string): Promise<DataResponse<Player[]>> {
    const query = 'SELECT * FROM player WHERE group_id=$1'
    const params = [groupId]
    return await this.returnMany(query, params)
  }

  async getPlayerById(id: string): Promise<DataResponse<Player>> {
    const query = `SELECT * FROM player WHERE id=$1`
    const params = [id]
    return await this.returnOne(query, params)
  }

  async createPlayer({ groupId, userId, name, tank, healer, dps, locked, inTheRoll }: Player): Promise<DataResponse<Player>> {
    const query = `INSERT INTO player (group_id, user_id, name, tank, healer, dps, locked, in_the_roll) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`
    const params = [groupId, userId, name, tank, healer, dps, locked, inTheRoll]
    return await this.returnOne(query, params)
  }
  async updatePlayer(input: UpdatePlayerInput): Promise<PlayerResponse> {

    const { error, data: currentPlayer } = await this.getPlayerById(input.id)
    if (error) {
      return {
        success: false,
        error: error
      }
    }
    if (currentPlayer) {
      const res = this.validateUpdate(input, currentPlayer)
      if (res.error) {
        return res
      }
      if (res.data && res.success) {
        const { userId, name, tank, healer, dps, locked, inTheRoll } = res.data
        const query = 'UPDATE player SET user_id=$1, name=$2, tank=$3, healer=$4, dps=$5, locked=$6, in_the_roll=$7 WHERE id=$8 RETURNING *'
        const params = [userId, name, tank, healer, dps, locked, inTheRoll, currentPlayer.id]
        return await this.returnOne(query, params)
      }
    }
    return {
      success: false,
      error: NotInDatabaseError('player', input.id)
    }
  }

  async deletePlayer(id: string): Promise<PlayerResponse> {
    const query = `DELETE FROM player WHERE id=$1`
    const params = [id]
    const res = await this.returnOne(query, params)
    if (res.error) {
      return {
        success: false,
        error: res.error
      }
    }
    return {
      success: true,
      error: null
    }
  }

  protected checkIfGroupIdMatchesInput(inputGroupId: string, groupId: string): boolean {
    return inputGroupId === groupId
  }

  private validateUpdate(input: PlayerInput, currentPlayer: Player): DataResponse<Player> {
    const validToProceed = this.checkIfGroupIdMatchesInput(input.groupId, currentPlayer.groupId)
    if (validToProceed) {
      const playerForUpdate = input as Player
      for (const key in Object.keys(input)) {
        if (input[key] === undefined) {
          playerForUpdate[key] = currentPlayer[key]
        }
      }
      return {
        data: playerForUpdate,
        success: false,
        error: null
      }
    }
    return {
      data: null,
      success: false,
      error: AuthorizationError
    }
  }

}

