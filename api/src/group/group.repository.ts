import { DatabaseService } from "../common/database.service";
import { DataServiceAbstract } from "../common/dataService.abstract";
import { Logger, LoggerService } from "../common/logger.service";
import { addToContainer } from "../container";
import { DbGroup, Group, ICreateGroup } from "../types/group";

@addToContainer()
export class GroupRepository extends DataServiceAbstract<DbGroup, Group>{
  logger: Logger
  db: DatabaseService
  constructor(private database: DatabaseService, private ls: LoggerService) {
    super()
    this.db = this.database
    this.logger = this.ls.getLogger(GroupRepository.name)
  }

  mapToCamelCase = ({ id, user_id, relations, roll_type, lock_after_out, members_can_update, created_at, updated_at, name }: DbGroup): Group => {
    return {
      id,
      name,
      userId: user_id,
      relations,
      rollType: roll_type,
      lockAfterOut: lock_after_out,
      membersCanUpdate: members_can_update,
      createdAt: created_at,
      updatedAt: updated_at
    }
  }

  async getGroups() {
    const query = `SELECT * FROM public.group;`
    const params: any[] = []
    return await this.returnMany(query, params)

  }

  async getGroupById(id: string) {
    const query = `SELECT * FROM public.group WHERE id=$1`
    const params = [id]
    return await this.returnOne(query, params)
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

  async createGroup(userId: string, { name, rollType, membersCanUpdate, lockAfterOut }: ICreateGroup) {
    const query = `INSERT INTO public.group (user_id, name, roll_type, members_can_update, lock_after_out, relations) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`
    const values = [userId, name, rollType, membersCanUpdate, lockAfterOut, { members: [], players: [] }]
    return await this.returnOne(query, values)
  }

  async updateGroup(group: Group) {
    const query = `UPDATE public.group SET members=$2, players=$3, roll_type=$4, lock_after_out=$5, members_can_update=$6, name=$7 WHERE id=$1 RETURNING *;`
    const params = [group.id, group.relations.members, group.relations.players, group.rollType, group.lockAfterOut, group.membersCanUpdate, group.name]
    const res = await this.returnOne(query, params)
    return res
  }

  async deleteByUserId(groupId: string, userId: string) {
    const query = 'DELETE FROM public.group WHERE id=$1 AND user_id=$2'
    const params = [groupId, userId]
    return this.returnOne(query, params)
  }
}