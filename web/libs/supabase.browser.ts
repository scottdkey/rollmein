import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../types_db";

export const supabaseBrowser = () => createPagesBrowserClient<Database>()