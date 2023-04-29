export interface UserOptions {
  userId: string
  theme: Theme
  createdAt: string
  updatedAt: string
}

export interface DbUserOptions {
  user_id: string
  theme: Theme
  created_at: string
  updated_at: string
}

enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export interface UserOptionsInput {
  theme: Theme
}