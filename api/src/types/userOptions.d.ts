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

enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

interface UserOptionsInput {
  theme: Theme
}