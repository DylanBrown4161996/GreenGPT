"use client";

import { useMemo, useState } from "react";
import type { AdminOverviewData, AdminSubscriberRow } from "@/lib/admin/queries";

const B = {
  forest: "#0B3D2E",
  cream: "#FAF7F2",
  charcoal: "#1B2A22",
  emerald: "#10B981",
};

type Tab = "all" | "pro" | "enterprise" | "free" | "past_due";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function displayName(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function initials(email: string): string {
  const parts = email.split("@")[0].split(/[._-]/).filter(Boolean);
  return (parts[0]?.[0] ?? "?").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
}

function planBadge(tier: string) {
  if (tier === "enterprise") return { label: "Enterprise", bg: B.forest, color: "#fff" };
  if (tier === "pro") return { label: "Pro", bg: "#D1FAE5", color: B.forest };
  return { label: "Free", bg: "#F3F4F6", color: "#666" };
}

function statusDisplay(status: string) {
  if (status === "active") return { label: "Active", dot: B.emerald };
  if (status === "past_due") return { label: "Past due", dot: "#E8614D" };
  if (status === "trialing") return { label: "Trialing", dot: "#D4A017" };
  return { label: status === "none" ? "—" : status, dot: "#CCC" };
}

function filterRows(rows: AdminSubscriberRow[], tab: Tab): AdminSubscriberRow[] {
  if (tab === "all") return rows;
  if (tab === "pro") return rows.filter((r) => r.tier === "pro");
  if (tab === "enterprise") return rows.filter((r) => r.tier === "enterprise");
  if (tab === "free") return rows.filter((r) => r.tier === "free" || !r.mrr);
  if (tab === "past_due") return rows.filter((r) => r.status === "past_due");
  return rows;
}

function exportCsv(rows: AdminSubscriberRow[]) {
  const header = ["email", "plan", "status", "updated_at", "mrr"];
  const lines = rows.map((r) =>
    [r.email, r.tier, r.status, r.updatedAt, String(r.mrr)]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `greengpt-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminOverviewClient({ data }: { data: AdminOverviewData }) {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let rows = filterRows(data.subscribers, tab);
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) => r.email.toLowerCase().includes(q) || displayName(r.email).toLowerCase().includes(q)
      );
    }
    return rows;
  }, [data.subscribers, tab, search]);

  const updatedLabel = relativeTime(data.updatedAt);
  const mono = "'IBM Plex Mono', monospace";
  const serif = "'Instrument Serif', serif";

  const kpis = [
    { label: "Total users", value: String(data.kpis.totalUsers) },
    { label: "Pro subscribers", value: String(data.kpis.proCount) },
    { label: "Enterprise", value: String(data.kpis.enterpriseCount) },
    {
      label: "Monthly recurring",
      value: `$${data.kpis.monthlyRecurring.toLocaleString()}`,
      highlight: true,
    },
    {
      label: "Paying accounts",
      value: String(data.kpis.payingCount),
    },
  ];

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pro", label: "Pro" },
    { id: "enterprise", label: "Enterprise" },
    { id: "free", label: "Free" },
    { id: "past_due", label: "Past due" },
  ];

  const usageItems = [
    { label: "Facility intakes (30d)", value: data.featureUsage30d.facilityIntakes },
    { label: "Reminder rows (30d)", value: data.featureUsage30d.reminderEmailsSent },
    { label: "Calendars emailed (30d)", value: data.featureUsage30d.calendarsEmailed },
    { label: "Documents uploaded (30d)", value: data.featureUsage30d.documentsUploaded },
    { label: ".ics exports", value: "—" },
  ];

  const maxUsage = Math.max(...usageItems.map((u) => (typeof u.value === "number" ? u.value : 0)), 1);

  return (
    <div style={{ padding: "28px 32px 48px", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: serif, fontSize: 32, color: B.forest, margin: 0 }}>Overview</h1>
          <p style={{ fontSize: 13, color: "#888", margin: "6px 0 0", fontWeight: 300 }}>
            Subscriber &amp; revenue health · updated {updatedLabel}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="search"
            placeholder="Search subscribers"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "9px 14px",
              borderRadius: 8,
              border: "1.5px solid #E0DDD6",
              fontSize: 13,
              width: 200,
              background: "#fff",
            }}
          />
          <button
            type="button"
            onClick={() => exportCsv(filtered)}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              border: "none",
              background: B.forest,
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div
            key={k.label}
            style={{
              background: k.highlight ? B.forest : "#fff",
              color: k.highlight ? "#fff" : B.charcoal,
              borderRadius: 12,
              padding: "18px 16px",
              border: k.highlight ? "none" : "1.5px solid #E8E6E0",
            }}
          >
            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", opacity: k.highlight ? 0.7 : 0.5, marginBottom: 8 }}>
              {k.label.toUpperCase()}
            </div>
            <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 400 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1.5px solid #E8E6E0",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "18px 20px", borderBottom: "1.5px solid #EEF0ED", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: B.charcoal }}>Subscribers</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                {data.kpis.totalUsers} known emails · {data.kpis.payingCount} paying
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    border: "1.5px solid",
                    borderColor: tab === t.id ? B.forest : "#E0DDD6",
                    background: tab === t.id ? B.forest : "#fff",
                    color: tab === t.id ? "#fff" : "#666",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#FAFAF8", textAlign: "left" }}>
                  {["Subscriber", "Plan", "Status", "Updated", "MRR"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        fontFamily: mono,
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        color: "#999",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#AAA" }}>
                      No subscribers match this filter.
                    </td>
                  </tr>
                )}
                {filtered.map((row) => {
                  const badge = planBadge(row.tier);
                  const st = statusDisplay(row.status);
                  return (
                    <tr key={row.email} style={{ borderTop: "1px solid #F0EFEB" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: "#E8F5EF",
                              color: B.forest,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {initials(row.email)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: B.charcoal }}>{displayName(row.email)}</div>
                            <div style={{ fontSize: 11, color: "#999" }}>{row.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            fontFamily: mono,
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background: badge.bg,
                            color: badge.color,
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot }} />
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#666", fontSize: 11 }}>
                        <div>{formatDate(row.updatedAt)}</div>
                        <div style={{ color: "#AAA" }}>{relativeTime(row.updatedAt)}</div>
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: mono, fontWeight: 600, color: B.charcoal }}>
                        ${row.mrr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E8E6E0", padding: "18px 20px" }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, color: B.charcoal }}>Plan distribution</div>
            <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ width: `${data.planDistribution.freePct}%`, background: "#E5E7EB" }} />
              <div style={{ width: `${data.planDistribution.proPct}%`, background: "#6EE7B7" }} />
              <div style={{ width: `${data.planDistribution.enterprisePct}%`, background: B.forest }} />
            </div>
            <div style={{ fontSize: 11, color: "#666", lineHeight: 1.8 }}>
              <div>Free {data.planDistribution.freePct}%</div>
              <div>Pro {data.planDistribution.proPct}%</div>
              <div>Enterprise {data.planDistribution.enterprisePct}%</div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E8E6E0", padding: "18px 20px" }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, color: B.charcoal }}>Feature usage (last 30 days)</div>
            {usageItems.map((item) => (
              <div key={item.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: "#666" }}>{item.label}</span>
                  <span style={{ fontFamily: mono, fontWeight: 600 }}>{item.value}</span>
                </div>
                {typeof item.value === "number" && (
                  <div style={{ height: 4, background: "#F0EFEB", borderRadius: 2 }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.round((item.value / maxUsage) * 100)}%`,
                        background: B.emerald,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E8E6E0", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#666" }}>Billing data source</span>
            <span style={{ fontFamily: mono, fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "#D1FAE5", color: B.forest, fontWeight: 600 }}>
              Supabase
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
