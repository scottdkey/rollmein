import { RollType } from '../roll/roll.service';
import { DataResponse } from "./DataResponse";

interface DbGroup {
  id: string
  name: string
  user_id: string
  relations: { members: string[], players: [] }
  roll_type: RollType
  lock_after_out: boolean
  members_can_update: boolean
  created_at: string
  updated_at: string
}

interface ICreateGroup {
  name: string
  rollType: RollType
  membersCanUpdate: boolean
  lockAfterOut: boolean
}

interface IGroupError {
  response: {
    status: number
  }
}

interface IGroupDelete {
  id: string
}

interface IGroup extends ICreateGroup {
  id: string
  relations: { members: string[], players: string[] }
  userId: string
  createdAt: string
  updatedAt: string
}

interface IGroupUpdate {
  id: string,
  name?: string,
  membersCanUpdate?: boolean,
  rollType?: RollType,
  lockAfterOut?: boolean,
  memberId?: string,
  playerId?: string
}