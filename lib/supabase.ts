import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function normalizeSupabaseUrl(url: string) {
  return url.replace(/\/rest\/v1\/?$/, "");
}

export function getSupabasePublicClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }

  return createClient(normalizeSupabaseUrl(supabaseUrl), supabasePublishableKey);
}

export { supabasePublishableKey, supabaseUrl };
