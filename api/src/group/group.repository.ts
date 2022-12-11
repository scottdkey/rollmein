import { DatabaseService } from "../common/database.service";
import { DataServiceAbstract } from "../common/dataService.abstract";
import { addToContainer } from "../container";
import { DbGroup, Group, GroupResponse, GroupsResponse, ICreateGroup } from "../types/group";

@addToContainer()
export class GroupRepository extends DataServiceAbstract<DbGroup, Group>{

  db: DatabaseService
  constructor(private database: DatabaseService) {
    super()
    this.db = this.database
  }

  mapToCamelCase = ({ id, user_id, players, members, roll_type, lock_after_out, members_can_update, created_at, updated_at, name }: DbGroup): Group => {
    return {
      id,
      name,
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

  async getGroups(){
    const query = `SELECT * FROM public.group;`
    const params: any[] = []
    return await this.returnMany(query, params)

  }

  async getGroupById(id: string){
    const query = `SELECT * FROM public.group WHERE id=$1`
    const params = [id]
    return this.returnOne(query, params)
  }

  async getGroupsByUserId(userId: string) {
    const query = `SELECT * FROM public.group WHERE user_id=$1 OR $1=ANY(members);`
    const params = [userId]
    return this.returnMany(query, params)
  }
  async getGroupsByPlayerId(playerId: string) {
    const query = `SELECT * FROM public.group WHERE $1=ANY(players)`
    const params = [playerId]
    return this.returnMany(query, params)
  }

  async createGroup(userId: string, {name, rollType, membersCanUpdate, lockAfterOut}: ICreateGroup) {
    const query = `INSERT INTO public.group (user_id, name, roll_type, members_can_update, lock_after_out) VALUES ($1, $2, $3, $4, $5) RETURNING *;`
    const values = [userId, name, rollType, membersCanUpdate, lockAfterOut]
    return this.returnOne(query, values)
  }

  async updateGroup(group: Group) {
    const query = `UPDATE player_group SET members=$2::uuid[], players=$3::uuid[], roll_type=$4, lock_after_out=$5, members_can_update=$6 WHERE id=$1 RETURNING *;`
    const params = [group.id, group.members, group.players, group.rollType, group.lockAfterOut, group.membersCanUpdate]
    return await this.returnOne(query, params)
  }

  async deleteByUserId(groupId: string, userId: string) {
    const query = 'DELETE FROM player_group WHERE id=$1 AND user_id=$2'
    const params = [groupId, userId]
    return this.returnOne(query, params)
  }
}