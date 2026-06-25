"use client";

import { useMemo, useState } from "react";
import type { AdminIntakeRow } from "@/lib/admin/queries";

const B = {
  forest: "#0B3D2E",
  charcoal: "#1B2A22",
  emerald: "#10B981",
};

const INDUSTRY_LABELS: Record<string, string> = {
  chemical_mfg: "Chemical Mfg",
  plastics_mfg: "Plastics Mfg",
  food_bev: "Food & Bev",
  pharma: "Pharma",
  metals_mfg: "Metals Mfg",
  oil_gas: "Oil & Gas",
  construction: "Construction",
  warehousing: "Warehousing",
  healthcare: "Healthcare",
  other: "Other",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function DetailBlock({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value?.trim()) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: "#999", marginBottom: 4, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: B.charcoal, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{value}</div>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (!items.length) return <span style={{ fontSize: 12, color: "#AAA" }}>None</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {items.map((item) => (
        <span
          key={item}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            padding: "3px 8px",
            borderRadius: 4,
            background: "#E8F5EF",
            color: B.forest,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function AdminIntakesClient({ rows }: { rows: AdminIntakeRow[] }) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(rows[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.company.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.contactName.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const mono = "'IBM Plex Mono', monospace";
  const serif = "'Instrument Serif', serif";
  const selected = filtered.find((r) => r.id === expandedId) ?? null;

  return (
    <div style={{ padding: "28px 32px 48px", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: serif, fontSize: 32, color: B.forest, margin: 0 }}>Facility intakes</h1>
          <p style={{ fontSize: 13, color: "#888", margin: "6px 0 0", fontWeight: 300 }}>
            Managed compliance onboarding submissions · {rows.length} total
          </p>
        </div>
        <input
          type="search"
          placeholder="Search company, contact, email, state"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "9px 14px",
            borderRadius: 8,
            border: "1.5px solid #E0DDD6",
            fontSize: 13,
            width: 280,
            background: "#fff",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20, alignItems: "start" }}>
        <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E8E6E0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#FAFAF8", textAlign: "left" }}>
                {["Submitted", "Company", "Contact", "State", "Industry"].map((h) => (
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
                  <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#AAA" }}>
                    {rows.length === 0
                      ? "No intakes yet. Submissions from /intake will appear here."
                      : "No intakes match your search."}
                  </td>
                </tr>
              )}
              {filtered.map((row) => {
                const active = row.id === expandedId;
                return (
                  <tr
                    key={row.id}
                    onClick={() => setExpandedId(row.id)}
                    style={{
                      borderTop: "1px solid #F0EFEB",
                      cursor: "pointer",
                      background: active ? "#F4FBF7" : "transparent",
                    }}
                  >
                    <td style={{ padding: "12px 16px", color: "#666" }}>
                      <div>{formatDate(row.createdAt)}</div>
                      <div style={{ color: "#AAA", fontSize: 11 }}>{relativeTime(row.createdAt)}</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: B.charcoal }}>{row.company}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 500 }}>{row.contactName}</div>
                      <div style={{ fontSize: 11, color: "#999" }}>{row.email}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#666" }}>{row.state}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 10,
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: "#F3F4F6",
                          color: "#666",
                        }}
                      >
                        {INDUSTRY_LABELS[row.industry] ?? row.industry}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selected && (
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1.5px solid #E8E6E0",
              padding: "20px 22px",
              position: "sticky",
              top: 20,
              maxHeight: "calc(100vh - 80px)",
              overflow: "auto",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 16, color: B.charcoal, marginBottom: 4 }}>{selected.company}</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
              {selected.contactName} · {selected.email}
            </div>

            <DetailBlock label="Phone" value={selected.payload.phone} />
            <DetailBlock label="Job title" value={selected.payload.title} />
            <DetailBlock
              label="Address"
              value={[selected.payload.address, selected.payload.city, selected.payload.state, selected.payload.zip]
                .filter(Boolean)
                .join(", ")}
            />
            <DetailBlock label="Employees" value={selected.payload.employees} />
            <DetailBlock label="Shifts" value={selected.payload.shifts} />
            <DetailBlock label="NAICS" value={selected.payload.naics} />

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: "#999", marginBottom: 6, textTransform: "uppercase" }}>
                Permits
              </div>
              <TagList items={selected.payload.permits} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: "#999", marginBottom: 6, textTransform: "uppercase" }}>
                Hazards
              </div>
              <TagList items={selected.payload.hazards} />
            </div>

            <DetailBlock label="Chemicals" value={selected.payload.chemicals} />
            <DetailBlock label="Waste streams" value={selected.payload.waste_streams} />
            <DetailBlock label="Equipment" value={selected.payload.equipment} />
            <DetailBlock label="Current tracking" value={selected.payload.current_system} />
            <DetailBlock label="Pain points" value={selected.payload.pain_points} />
            <DetailBlock label="Audit history" value={selected.payload.audit_history} />
            <DetailBlock label="Goals" value={selected.payload.goals} />

            <a
              href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.company} compliance intake`)}`}
              style={{
                display: "inline-block",
                marginTop: 8,
                padding: "10px 16px",
                borderRadius: 8,
                background: B.forest,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Reply to contact
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
