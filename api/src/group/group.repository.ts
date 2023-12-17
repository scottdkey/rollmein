import { Logger } from "pino";
import { DataServiceAbstract } from "../data/dataService.abstract.js";
import { DatabaseService } from "../database/database.service.js";
import { addToContainer } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";
import { DbGroup, ICreateGroup, IGroup } from "../types/Group.js";

@addToContainer()
export class GroupRepository extends DataServiceAbstract<DbGroup, IGroup> {
  logger: Logger;
  db: DatabaseService;
  constructor(private database: DatabaseService, private ls: LoggerService) {
    super();
    this.db = this.database;
    this.logger = this.ls.getLogger(GroupRepository.name);
  }

  mapToCamelCase = ({
    id,
    user_id,
    relations,
    roll_type,
    lock_after_out,
    members_can_update,
    created_at,
    updated_at,
    name,
  }: DbGroup): IGroup => {
    return {
      id,
      name,
      userId: user_id,
      relations,
      rollType: roll_type,
      lockAfterOut: lock_after_out,
      membersCanUpdate: members_can_update,
      createdAt: created_at,
      updatedAt: updated_at,
    };
  };

  async getGroups() {
    const query = `SELECT * FROM public.group;`;
    const params: any[] = [];
    return await this.returnMany(query, params);
  }

  async getGroupById(id: string) {
    const query = `SELECT * FROM public.group WHERE id=$1`;
    const params = [id];
    return await this.returnOne(query, params);
  }

  async getGroupsByUserId(userId: string) {
    try {
      const res = await this.getGroups();
      if (res) {
        return res.filter((group: IGroup) => {
          const includes = group.relations.members.includes(userId);
          const isUser = group.userId !== userId;
          if (isUser || includes) {
            return group;
          }
          return;
        });
      }
      return null;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
  async getGroupsByPlayerId(playerId: string) {
    const res = await this.getGroups();
    if (res) {
      return res.filter((group: IGroup) => {
        if (group.relations.players.includes(playerId)) {
          return group;
        }
        return;
      });
    }
    return null;
  }

  async createGroup(
    userId: string,
    { name, rollType, membersCanUpdate, lockAfterOut }: ICreateGroup
  ) {
    const query = `INSERT INTO public.group (user_id, name, roll_type, members_can_update, lock_after_out, relations) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
    const values = [
      userId,
      name,
      rollType,
      membersCanUpdate,
      lockAfterOut,
      { members: [], players: [] },
    ];
    return await this.returnOne(query, values);
  }

  async updateGroup(group: IGroup) {
    const query = `UPDATE public.group SET relations=$2, roll_type=$3, lock_after_out=$4, members_can_update=$5, name=$6 WHERE id=$1 RETURNING *;`;
    const params = [
      group.id,
      group.relations,
      group.rollType,
      group.lockAfterOut,
      group.membersCanUpdate,
      group.name,
    ];
    return await this.returnOne(query, params);
  }

  async deleteByUserId(groupId: string, userId: string) {
    const query = "DELETE FROM public.group WHERE id=$1 AND user_id=$2";
    const params = [groupId, userId];
    const res = await this.returnOne(query, params);
    if (res) {
      return true;
    }
    return false;
  }
}
