import { requireAdmin } from "@/lib/admin/requireAdmin";
import { signOutAdmin } from "../login/actions";
import AdminNav from "../AdminNav";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const initials = admin.email
    .split("@")[0]
    .split(/[._]/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className="fixed inset-0 z-50 flex overflow-hidden"
      style={{ background: "#FAF7F2", fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Outfit:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`}</style>

      <aside
        style={{
          width: 220,
          background: "#063321",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              g
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: "0.02em" }}>greenGPT</div>
              <div style={{ fontSize: 9, opacity: 0.55, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Admin Console
              </div>
            </div>
          </div>
        </div>

        <AdminNav />

        <div
          style={{
            padding: "16px 18px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {initials || "A"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>
              {admin.email.split("@")[0]}
            </div>
            <div style={{ fontSize: 10, opacity: 0.55 }}>Owner · Admin</div>
          </div>
          <form action={signOutAdmin}>
            <button
              type="submit"
              title="Sign out"
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              Out
            </button>
          </form>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  );
}
