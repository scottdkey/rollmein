interface Player {
  [key: string]: unknown
  id: string
  groupId: string
  userId: string | null
  name: string | null
  tank: boolean
  healer: boolean
  dps: boolean
  locked: boolean
  inTheRoll: boolean
  createdAt?: string
  updatedAt?: string
}

interface PlayerInput {
  [key: string]: unknown
  groupId: string
  userId?: string | null
  name?: string | null
  tank?: boolean
  healer?: boolean
  dps?: boolean
  locked?: boolean
  inTheRoll?: boolean
}

interface UpdatePlayerInput extends PlayerInput {
  id: string
}
interface DbPlayer {
  id: string,
  group_id: string,
  user_id: string
  name: string
  tank: boolean,
  healer: boolean
  dps: boolean
  locked: boolean
  in_the_roll: boolean
  created_at: string
  updated_at: string
}

type PlayerResponse = DataResponse<Player>

type PlayersResponse = DataResponse<Player[]>