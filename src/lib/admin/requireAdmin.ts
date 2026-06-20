import { redirect } from "next/navigation";
import { isAdminEmail } from "./allowlist";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
};

export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdminEmail(user.email)) {
    redirect("/admin/login");
  }

  return { id: user.id, email: user.email.trim().toLowerCase() };
}

export async function getOptionalAdminUser(): Promise<AdminUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdminEmail(user.email)) return null;
  return { id: user.id, email: user.email.trim().toLowerCase() };
}
