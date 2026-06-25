"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV: { label: string; href: string; disabled?: boolean }[] = [
  { label: "Overview", href: "/admin" },
  { label: "Facility intakes", href: "/admin/intakes" },
  { label: "Subscribers", href: "#", disabled: true },
  { label: "Revenue", href: "#", disabled: true },
  { label: "Calendars", href: "#", disabled: true },
  { label: "Documents", href: "#", disabled: true },
  { label: "GreenGPT AI", href: "#", disabled: true },
  { label: "Settings", href: "#", disabled: true },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav style={{ flex: 1, padding: "12px 10px" }}>
      {NAV.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname?.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-disabled={item.disabled}
            style={{
              display: "block",
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: item.disabled ? "rgba(255,255,255,0.35)" : active ? "#fff" : "rgba(255,255,255,0.75)",
              background: active ? "rgba(16,185,129,0.2)" : "transparent",
              borderLeft: active ? "3px solid #10B981" : "3px solid transparent",
              marginBottom: 2,
              pointerEvents: item.disabled ? "none" : undefined,
              textDecoration: "none",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
