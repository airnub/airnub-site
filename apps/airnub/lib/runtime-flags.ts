import { unstable_cache } from "next/cache";
import { getServiceRoleClient, type RuntimeFlagRow } from "@airnub/db";

const fetchMaintenanceFlag = unstable_cache(async (): Promise<RuntimeFlagRow | null> => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  try {
    const client = getServiceRoleClient();
    const { data, error } = await client
      .from("runtime_flags")
      .select("key,value,updated_at,updated_by")
      .eq("key", "maintenance_mode")
      .maybeSingle();

    if (error) {
      return null;
    }

    return (data as RuntimeFlagRow | null) ?? null;
  } catch {
    return null;
  }
}, ["runtime-maintenance"], {
  revalidate: 60,
});

export async function isMaintenanceModeEnabled() {
  const flag = await fetchMaintenanceFlag();

  if (flag && typeof flag.value === "boolean") {
    return flag.value;
  }

  return process.env.MAINTENANCE_MODE === "true";
}

export async function getMaintenanceFlag() {
  return fetchMaintenanceFlag();
}
