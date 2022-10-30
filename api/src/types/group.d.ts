import { RollType } from '../roll/roll.service';
import { DataResponse } from "./DataResponse";

interface DbGroup {
  id: string
  user_id: string
  players: string[]
  members: string[]
  roll_type: RollType
  lock_after_out: boolean
  members_can_update: boolean
  created_at: string
  updated_at: string
}

interface Group {
  id: string
  userId: string
  players: string[]
  members: string[]
  rollType: RollType,
  membersCanUpdate: boolean
  lockAfterOut: boolean,
  createdAt: string
  updatedAt: string
}

interface IGroupUpdateParams {
  membersCanUpdate?: boolean,
  rollType?: RollType,
  lockAfterOut?: boolean,
  memberId?: string,
  playerId?: string
}

type GroupResponse = DataResponse<Group>
type GroupsResponse = DataResponse<Group[]>