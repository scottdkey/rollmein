import { DatabaseService } from './database.service';
import { addToContainer } from "../container";
import { DataServiceAbstract } from "./dataService.abstract";
import type {DbGroup, Group, GroupResponse, GroupsResponse, IGroupUpdateParams} from '../types/group';
import {AuthorizationErrorResponse} from "../utils/errorsHelpers";


@addToContainer()
export class GroupService extends DataServiceAbstract<DbGroup, Group>{

  db: DatabaseService
  constructor(private database: DatabaseService) {
    super()
    this.db = this.database
  }

  mapToCamelCase = ({ id, user_id, players, members, roll_type, lock_after_out, members_can_update, created_at, updated_at }: DbGroup): Group => {
    return {
      id,
      userId: user_id,
      players,
      members,
      rollType: roll_type,
      lockAfterOut: lock_after_out,
      membersCanUpdate: members_can_update,
      createdAt: created_at,
      updatedAt: updated_at
    }
  }

  async getGroupById(id: string): Promise<GroupResponse>{
    const query = `SELECT * FROM player_group WHERE id=$1`
    const params = [id]
    return this.returnOne(query, params)
  }

  async getGroupsByUserId(userId: string): Promise<GroupsResponse>{
    const query = `SELECT * FROM player_group WHERE user_id=$1 OR $1=ANY(members);`
    const params = [userId]
    return this.returnMany(query, params)
  }
  async getGroupsByPlayerId(playerId: string): Promise<GroupsResponse>{
    const query = `SELECT * FROM player_group WHERE $1=ANY(players)`
    const params = [playerId]
    return this.returnMany(query, params)
  }

  async createGroup(userId: string): Promise<GroupResponse>{
    const query = `INSERT INTO player_group (user_id) VALUES ($1) RETURNING *;`
    const values = [userId]
    return this.returnOne(query, values)
  }

  async updateGroup(
      groupId: string,
      userId: string,
      updateValueInput: IGroupUpdateParams): Promise<GroupResponse>{
    const groupQuery = await this.getGroupById(groupId)
    if(groupQuery.success && groupQuery.data){
      const group = groupQuery.data
      group.members = updateValueInput.memberId ? [...new Set([...group.members, updateValueInput.memberId]) ]: group.members
      group.players = updateValueInput.playerId ? [...new Set([...group.players, updateValueInput.playerId]) ]: group.players
      group.rollType = updateValueInput.rollType ? updateValueInput.rollType : group.rollType
      group.lockAfterOut = updateValueInput.lockAfterOut ? updateValueInput.lockAfterOut : group.lockAfterOut
      group.membersCanUpdate = updateValueInput.membersCanUpdate ? updateValueInput.membersCanUpdate : group.membersCanUpdate
      const authorized = this.checkIfAuthorized(group, userId)
      if(!authorized){
        return AuthorizationErrorResponse
      }
      const query = `UPDATE player_group SET members=$2::uuid[], players=$3::uuid[], roll_type=$4, lock_after_out=$5, members_can_update=$6 WHERE id=$1 RETURNING *;`
      const params = [group.id, group.members, group.players, group.rollType, group.lockAfterOut, group.membersCanUpdate]
      return await this.returnOne(query, params)
    }
    return groupQuery
  }
  async deleteGroup(id: string, userId: string): Promise<GroupResponse>{
    const groupQuery = await this.getGroupById(id)
    const authorized = groupQuery.data && this.checkIfAuthorized(groupQuery.data, userId)
    if(!authorized){
      return AuthorizationErrorResponse
    }
    const query = 'DELETE FROM player_group WHERE id=$1 AND user_id=$2'
    const params = [id, userId]
    return this.returnOne(query, params)
  }

  protected checkIfAuthorized(group: Group, userIdFromRequest: string){
    if(!group.membersCanUpdate){
      return group.userId === userIdFromRequest
    }
    return group.members.includes(userIdFromRequest)
  }
}