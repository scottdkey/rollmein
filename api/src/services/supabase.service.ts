import { addToContainer } from "../container";
import { SupabaseClient, createClient } from "@supabase/supabase-js"


@addToContainer()
export class SupabaseService {
  supabase: SupabaseClient
  constructor() {
    this.supabase = createClient('', '')
  }

}