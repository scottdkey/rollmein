import { DataResponse } from "../../../shared/types/DataResponse"
import { DataServiceAbstract } from "../common/data/dataService.abstract"
import { DatabaseService } from "../common/database/database.service"
import { addToContainer } from "../container"

@addToContainer()
export class PlayerRepository extends DataServiceAbstract<DbPlayer, IPlayer> {
  
  db: DatabaseService
  constructor(db: DatabaseService) {
    super()
    this.db = db
  }

  mapToCamelCase = ({ id, group_id, user_id, name, tank, healer, dps, locked, in_the_roll, created_at, updated_at }: DbPlayer): IPlayer => {
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

  async getPlayersByGroupId(groupId: string): Promise<DataResponse<IPlayer[]>> {
    const query = 'SELECT * FROM player WHERE group_id=$1'
    const params = [groupId]
    return await this.returnMany(query, params)
  }

  async getPlayerById(id: string): Promise<DataResponse<IPlayer>> {
    const query = `SELECT * FROM player WHERE id=$1`
    const params = [id]
    return await this.returnOne(query, params)
  }
  async getPlayerByUserId(userId: string) {
    const query = `SELECT * FROM player WHERE user_id=$1`
    const params = [userId]
    return await this.returnOne(query, params)
  }

  async getUserPlayerFromGroup(userId: string, groupId: string) {
    const query = `SELECT * FROM player WHERE user_id=$1 AND group_id=$2`
    const params = [userId, groupId]
    return await this.returnOne(query, params)
  }

  async createPlayer({ groupId, userId, name, tank, healer, dps, locked, inTheRoll }: ICreatePlayer) {
    const query = `INSERT INTO player (group_id, user_id, name, tank, healer, dps, locked, in_the_roll) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`
    const params = [groupId, userId, name, tank, healer, dps, locked, inTheRoll]
    return await this.returnOne(query, params)
  }


  async updatePlayer({ name, tank, healer, dps, locked, inTheRoll, id }: IUpdatePlayer) {
    const query = 'UPDATE player SET name=$2, tank=$3, healer=$4, dps=$5, locked=$6, in_the_roll=$7 WHERE id=$1 RETURNING *'
    const params = [id, name, tank, healer, dps, locked, inTheRoll]
    return await this.returnOne(query, params)
  }

  async deletePlayer(id: string) {
    const query = `DELETE FROM player WHERE id=$1`
    const params = [id]
    const res = await this.returnOne(query, params)
    if (res.error) {
      return {
        data: null,
        success: false,
        error: res.error
      }
    }
    return {
      data: {
        id
      },
      success: true,
      error: null
    }
  }
}