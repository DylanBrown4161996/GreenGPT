import type { SupabaseClient } from "@supabase/supabase-js";
import type { BillingTier } from "@/lib/billing/tier";

export type AdminSubscriberRow = {
  email: string;
  tier: BillingTier | string;
  status: string;
  updatedAt: string;
  mrr: number;
};

export type AdminOverviewData = {
  updatedAt: string;
  kpis: {
    totalUsers: number;
    proCount: number;
    enterpriseCount: number;
    monthlyRecurring: number;
    payingCount: number;
    freeCount: number;
  };
  planDistribution: {
    freePct: number;
    proPct: number;
    enterprisePct: number;
  };
  featureUsage30d: {
    reminderEmailsSent: number;
    calendarsEmailed: number;
    documentsUploaded: number;
  };
  subscribers: AdminSubscriberRow[];
};

const PRO_MRR = 26;
const ENTERPRISE_MRR = 149;

function tierMrr(tier: string): number {
  if (tier === "pro") return PRO_MRR;
  if (tier === "enterprise") return ENTERPRISE_MRR;
  return 0;
}

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

async function distinctEmails(supabase: SupabaseClient, table: string, column: string): Promise<string[]> {
  const { data, error } = await supabase.from(table).select(column);
  if (error || !data || !Array.isArray(data)) return [];
  const set = new Set<string>();
  for (const row of data) {
    if (!row || typeof row !== "object") continue;
    const record = row as unknown as Record<string, unknown>;
    const val = String(record[column] ?? "")
      .trim()
      .toLowerCase();
    if (val) set.add(val);
  }
  return [...set];
}

export async function fetchAdminOverview(supabase: SupabaseClient): Promise<AdminOverviewData> {
  const since30d = daysAgoIso(30);

  const [
    { data: subscriptions, error: subErr },
    { count: emailSendCount },
    { count: reminderCount },
    { count: docCount },
    subEmails,
    reminderEmails,
    calendarEmails,
  ] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("customer_email,tier,status,updated_at")
      .order("updated_at", { ascending: false }),
    supabase
      .from("calendar_email_sends")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since30d),
    supabase
      .from("deadline_reminders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since30d),
    supabase
      .from("obligation_documents")
      .select("*", { count: "exact", head: true })
      .gte("uploaded_at", since30d),
    distinctEmails(supabase, "subscriptions", "customer_email"),
    distinctEmails(supabase, "deadline_reminders", "user_email"),
    distinctEmails(supabase, "calendar_email_sends", "email"),
  ]);

  if (subErr) throw new Error(subErr.message);

  const rows = subscriptions ?? [];
  const allUserEmails = new Set([...subEmails, ...reminderEmails, ...calendarEmails]);

  let proCount = 0;
  let enterpriseCount = 0;
  let monthlyRecurring = 0;

  const subscribers: AdminSubscriberRow[] = rows.map((row) => {
    const tier = (row.tier as string) ?? "free";
    const status = row.status ?? "none";
    if (tier === "pro") proCount += 1;
    if (tier === "enterprise") enterpriseCount += 1;
    monthlyRecurring += tierMrr(tier);

    return {
      email: row.customer_email,
      tier,
      status,
      updatedAt: row.updated_at,
      mrr: tierMrr(tier),
    };
  });

  const payingCount = proCount + enterpriseCount;
  const totalUsers = allUserEmails.size || rows.length;
  const freeCount = Math.max(0, totalUsers - payingCount);

  const totalForPct = Math.max(totalUsers, 1);
  const planDistribution = {
    freePct: Math.round((freeCount / totalForPct) * 1000) / 10,
    proPct: Math.round((proCount / totalForPct) * 1000) / 10,
    enterprisePct: Math.round((enterpriseCount / totalForPct) * 1000) / 10,
  };

  return {
    updatedAt: new Date().toISOString(),
    kpis: {
      totalUsers,
      proCount,
      enterpriseCount,
      monthlyRecurring,
      payingCount,
      freeCount,
    },
    planDistribution,
    featureUsage30d: {
      reminderEmailsSent: reminderCount ?? 0,
      calendarsEmailed: emailSendCount ?? 0,
      documentsUploaded: docCount ?? 0,
    },
    subscribers,
  };
}
