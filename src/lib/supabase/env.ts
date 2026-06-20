export function getSupabaseUrl(): string | null {
  return process.env.SUPABASE_URL ?? null;
}

export function getSupabaseAnonKey(): string | null {
  return process.env.SUPABASE_ANON_KEY ?? null;
}

export function assertSupabaseAuthEnv(): { url: string; anonKey: string } {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY.");
  }
  return { url, anonKey };
}
