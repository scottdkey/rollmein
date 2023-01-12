interface IValidateAuthBody {
  token: string | undefined
  authType: string
}

interface IValidateAuthRes {
  user: SessionUser
  success: boolean
  sessionId: string
}