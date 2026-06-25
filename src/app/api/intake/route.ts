import { NextRequest, NextResponse } from "next/server";
import { parseIntakeBody } from "@/lib/managed-compliance/intake";
import { sendIntakeAlert } from "@/lib/managed-compliance/sendIntakeAlert";
import { getSupabase } from "@/lib/server/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = parseIntakeBody(body);
    if (!parsed.data) {
      return NextResponse.json({ error: parsed.error ?? "Invalid intake." }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
    }

    const { data } = parsed;
    const { error } = await supabase.from("facility_intakes").insert({
      email: data.email,
      company: data.company,
      contact_name: data.contact,
      state: data.state,
      industry: data.industry,
      payload: data,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const notify = await sendIntakeAlert(data);
    if (!notify.sent) {
      console.warn("[intake] saved but alert email failed:", notify.error);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
