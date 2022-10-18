import { DataResponse } from "./DataResponse"

interface CreateUser {
  username: string
  email: string
  googleId?: string
  appleId?: string
  firebaseId: string
}

interface DbUser {
  id: string
  username: string
  email: string
  google_id: string,
  apple_id: string,
  firebase_id: string,
  created_at: string
  updated_at: string
}

interface User extends CreateUser {
  id: string
  createdAt: string
  updatedAt: string
}
interface ScrubbedUser {
  id: string
  username: string
}
interface RegisterUser {
  username: string,
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