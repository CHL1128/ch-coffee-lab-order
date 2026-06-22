import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicClient, normalizeSupabaseUrl, supabaseUrl } from "@/lib/supabase";

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseClient() {
  return getSupabasePublicClient();
}

export function getSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(normalizeSupabaseUrl(supabaseUrl), supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
