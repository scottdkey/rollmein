import { Theme } from "./Theme.enum"

interface UserOptions {
  userId: string
  theme: Theme
  createdAt: string
  updatedAt: string
}

interface DbUserOptions {
  user_id: string
  theme: Theme
  created_at: string
  updated_at: string
}

interface UserOptionsInput {
  theme: Theme
}