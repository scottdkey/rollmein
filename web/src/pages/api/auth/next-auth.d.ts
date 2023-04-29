import "next-auth";
import {Session as NextSession} from "next-auth"

declare module 'next-auth' {
  interface SessionUser {
    id: string
    username: string
    session: string
  }
  interface Session {
    id: string
    user: SessionUser
  }
}