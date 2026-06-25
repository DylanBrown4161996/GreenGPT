import { fetchFacilityIntakes } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/server/supabase";
import AdminIntakesClient from "../../AdminIntakesClient";

export default async function AdminIntakesPage() {
  await requireAdmin();

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return (
      <div style={{ padding: 40, color: "#666" }}>
        Database is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
      </div>
    );
  }

  const rows = await fetchFacilityIntakes(supabase);
  return <AdminIntakesClient rows={rows} />;
}
