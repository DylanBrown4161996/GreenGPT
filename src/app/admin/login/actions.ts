"use server";

import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin/allowlist";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type LoginState = {
  error?: string;
  success?: string;
};

export async function sendAdminMagicLink(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { error: "Email is required." };
  }

  if (!isAdminEmail(email)) {
    return { error: "This email is not authorized for admin access." };
  }

  const supabase = await createSupabaseServerClient();
  const headerList = await headers();
  const origin =
    headerList.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin.replace(/\/$/, "")}/admin/auth/callback?next=/admin`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your inbox for the admin sign-in link." };
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
