export interface Player {
  [key: string]: unknown
  id: string
  groupId: string | null
  userId: string | null
  name: string
  tank: boolean
  healer: boolean
  dps: boolean
  locked: boolean
  inTheRoll: boolean
  createdAt: string
  updatedAt: string
}

interface ICreatePlayer {
  groupId: string | null
  userId: string | null
  name: string
  tank: boolean
  healer: boolean
  dps: boolean
  locked: boolean
  inTheRoll: boolean
}

interface IUpdatePlayer extends ICreatePlayer {
  id: string
}

interface IDeletePlayer {
  id: string
}

interface IDeletePlayerResponse {
  id: string
}

interface DbPlayer {
  id: string,
  group_id: string | null
  user_id: string | null
  name: string
  tank: boolean,
  healer: boolean
  dps: boolean
  locked: boolean
  in_the_roll: boolean
  created_at: string
  updated_at: string
}