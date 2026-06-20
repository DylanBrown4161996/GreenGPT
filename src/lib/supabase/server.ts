import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { assertSupabaseAuthEnv } from "./env";

export async function createSupabaseServerClient() {
  const { url, anonKey } = assertSupabaseAuthEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll can fail in Server Components; middleware refreshes sessions.
        }
      },
    },
  });
}
