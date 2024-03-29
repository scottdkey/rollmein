interface DbUser {
  id: string
  username: string | null
  email: string
  google_id: string | null,
  apple_id: string | null,
  github_id: string | null,
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
  githubId: string | null
}

interface IMeRes { user: ScrubbedUser | null, success: boolean }

interface IProfileUpdateBody {
  username: string
}