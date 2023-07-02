import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "../types_db";

export const supabase = (req: NextRequest, res: NextResponse) => createMiddlewareClient<Database>({ req, res })