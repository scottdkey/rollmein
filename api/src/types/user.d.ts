import { DataResponse } from "./DataResponse"

interface DbUser {
  id: string
  username: string | null
  email: string
  google_id: string | null,
  apple_id: string | null,
  firebase_id: string,
  refresh_token: string,
  created_at: string
  updated_at: string
}

interface User extends RegisterUser {
  id: string
  createdAt: string
  updatedAt: string
}

interface CacheUser extends User {
  sessionExpires: string
}

interface ScrubbedUser {
  id: string
  username: string | null
}

interface RegisterUser {
  username: string | null,
  email: string | null,
  googleId: string | null,
  appleId: string | null,
  firebaseId: string,
  refreshToken: string
}

type UserResponse = DataResponse<Partial<User>>
type UsersResponse = DataResponse<Partial<User[]>>
type ScrubbedUserResponse = DataResponse<ScrubbedUser>
type ScrubbedUsersResponse = DataResponse<ScrubbedUser[]>