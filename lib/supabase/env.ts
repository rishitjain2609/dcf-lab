/** True once NEXT_PUBLIC_SUPABASE_URL/ANON_KEY are set, i.e. a Supabase project is connected. */
export function hasSupabase(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
