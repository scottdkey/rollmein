import { RollType } from "./Group.enum"
import { GroupWSMessageTypes } from "./GroupMessages.enum"

interface ITestMessageBody {
  sessionToken: string
  groupId: string
}

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

interface IJoinGroupReq {
  groupId: string
}

interface IJoinGroupRes {
  success: boolean
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

interface IGroupWs {
  group: IGroup
}

interface IGroupWsRequest {
  messageType: GroupWSMessageTypes
  sessionToken: string
  groupId: string
}

interface IGroupWsResponse {
  group: IGroup | null
  messageType: GroupWSMessageTypes
  rollStarted?: boolean
  data?: {
    message: string
    id: string
  }
}