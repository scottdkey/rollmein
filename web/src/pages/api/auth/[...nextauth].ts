
import { NextApiRequest, NextApiResponse } from "next"
import NextAuth, { AuthOptions, SessionStrategy } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { validateAuthRequest } from "../../../utils/authApi"


const githubOptions = {
  clientId: process.env.GITHUB_ID || "",
  clientSecret: process.env.GITHUB_SECRET || ""
}

const googleOptions = {
  clientId: process.env.GOOGLE_ID || "",
  clientSecret: process.env.GOOGLE_SECRET || ""
}


export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider(githubOptions),
    GoogleProvider(googleOptions)
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 7 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account && token) {

        const authType = account.provider
        const body = { token: account.id_token, authType }
        const res = await validateAuthRequest(body)
        if (res && res.success) {
          token.user = res.user
          token.sessionId = res.sessionId
        }
      }

      return token
    },
    session({ session, user, token }) {
      session.user = token.user as any
      session.id = token.sessionId as string

      return session

    }
  }
}
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions)
}