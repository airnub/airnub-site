"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getServiceRoleClient, insertLeadAction, upsertRuntimeFlag } from "@airnub/db";
import type { TablesInsert } from "@airnub/db";
import { LEAD_STATUSES, type LeadStatus } from "./statuses";

export type LeadActionFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export type MaintenanceFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const leadStatusSet = new Set<LeadStatus>(LEAD_STATUSES);

export async function submitLeadAction(_: LeadActionFormState, formData: FormData): Promise<LeadActionFormState> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      status: "error",
      message: "Supabase service role key is not configured.",
    };
  }

  const leadId = formData.get("leadId");
  const status = formData.get("status");

  if (typeof leadId !== "string" || leadId.length === 0) {
    return {
      status: "error",
      message: "Lead identifier is required.",
    };
  }

  if (typeof status !== "string" || !leadStatusSet.has(status as LeadStatus)) {
    return {
      status: "error",
      message: "Choose a valid status before saving.",
    };
  }

  const assignee = formData.get("assignee");
  const note = formData.get("note");
  const actor = formData.get("actor");

  const payload: TablesInsert<"lead_actions"> = {
    lead_id: leadId,
    status: status as LeadStatus,
    assignee: typeof assignee === "string" && assignee.trim().length > 0 ? assignee.trim() : null,
    note: typeof note === "string" && note.trim().length > 0 ? note.trim() : null,
    created_by: typeof actor === "string" && actor.trim().length > 0 ? actor.trim() : null,
  };

  const db = getServiceRoleClient();
  const { error } = await insertLeadAction(db, payload);

  if (error) {
    return {
      status: "error",
      message: "Unable to record the update. Please try again.",
    };
  }

  await revalidatePath("/admin/leads");

  return {
    status: "success",
    message: "Lead triage saved.",
  };
}

export async function updateMaintenanceMode(
  _: MaintenanceFormState,
  formData: FormData
): Promise<MaintenanceFormState> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      status: "error",
      message: "Supabase service role key is not configured.",
    };
  }

  const enabledInput = formData.get("enabled");

  if (typeof enabledInput !== "string" || !["true", "false"].includes(enabledInput)) {
    return {
      status: "error",
      message: "Choose whether maintenance mode should be on or off.",
    };
  }

  const actor = formData.get("actor");
  const enabled = enabledInput === "true";

  const payload: TablesInsert<"runtime_flags"> = {
    key: "maintenance_mode",
    value: enabled,
    updated_by: typeof actor === "string" && actor.trim().length > 0 ? actor.trim() : null,
    updated_at: new Date().toISOString(),
  };

  const db = getServiceRoleClient();
  const { error } = await upsertRuntimeFlag(db, payload);

  if (error) {
    return {
      status: "error",
      message: "Failed to update maintenance mode. Please try again.",
    };
  }

  await Promise.all([
    revalidatePath("/admin/leads"),
    revalidateTag("runtime-maintenance"),
  ]);

  return {
    status: "success",
    message: enabled ? "Maintenance mode enabled." : "Maintenance mode disabled.",
  };
}
