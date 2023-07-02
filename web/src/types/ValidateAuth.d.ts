export interface IValidateAuthBody {
  token: string | undefined
  authType: string
}

export interface IValidateAuthRes {
  user: SessionUser
  success: boolean
  sessionId: string
}