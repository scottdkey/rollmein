import NextAuth from "next-auth"
import { ScrubbedUser } from "@apiTypes/User"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Token {
    user: ScrubbedUser,
    sessionId: string
  }
  interface Session {
    id: string
    user: ScrubbedUser
  }
}