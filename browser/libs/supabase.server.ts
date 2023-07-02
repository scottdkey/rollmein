import { createServerComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "../types_db"

export const supabaseServerComponent = () => createServerComponentClient<Database>({ cookies })

export const supabaseServerAction = () => createServerActionClient<Database>({ cookies })