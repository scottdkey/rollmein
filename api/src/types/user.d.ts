import { DataResponse } from "./DataResponse"

interface DbUser {
  id: string
  username: string
  email: string
  google_id: string,
  apple_id: string,
  supabase_id: string,
  created_at: string
  updated_at: string
}

interface User {
  id: string
  username: string
  email: string
  googleId?: string
  appleId?: string
  supabaseId?: string
  createdAt: string
  updatedAt: string
}

type UserResponse = DataResponse<User>
type UsersResponse = DataResponse<User[]>