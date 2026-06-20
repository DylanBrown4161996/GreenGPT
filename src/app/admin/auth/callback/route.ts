import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin/allowlist";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (!code) {
    return NextResponse.redirect(new URL("/admin/login?error=missing_code", request.url));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdminEmail(user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/", request.url));
  }

  const safeNext = next.startsWith("/admin") ? next : "/admin";
  return NextResponse.redirect(new URL(safeNext, request.url));
}
