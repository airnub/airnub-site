import type { Metadata } from "next";
import { getServiceRoleClient, fetchRuntimeFlag, type LeadWithActions } from "@airnub/db";
import { MaintenanceToggleForm } from "./MaintenanceToggleForm";
import { LeadActionForm } from "./LeadActionForm";
import { LEAD_STATUS_LABELS } from "./statuses";

export const metadata: Metadata = {
  title: "Airnub admin · Leads",
  description: "Review inbound leads and keep the marketing site healthy while traveling.",
};

export const dynamic = "force-dynamic";

const STATUS_LABELS = LEAD_STATUS_LABELS;

function formatTimestamp(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, { hour12: false });
}

export default async function LeadsPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="space-y-6 text-slate-100">
        <h1 className="text-3xl font-semibold">Admin configuration missing</h1>
        <p className="text-sm text-slate-300">
          Add <code className="rounded bg-slate-800 px-1 py-0.5 text-xs">SUPABASE_SERVICE_ROLE_KEY</code>,
          <code className="ml-1 rounded bg-slate-800 px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>, and
          <code className="ml-1 rounded bg-slate-800 px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your
          environment variables to unlock the remote operations console.
        </p>
      </div>
    );
  }

  const serviceClient = getServiceRoleClient();

  const [{ data: leadRows, error: leadError }, { data: maintenanceFlag, error: maintenanceError }] = await Promise.all([
    serviceClient
      .from("contact_leads")
      .select(
        "id,created_at,full_name,email,company,message,source,consent,lead_actions(id,status,assignee,note,created_at,created_by)"
      )
      .order("created_at", { ascending: false })
      .limit(100),
    fetchRuntimeFlag(serviceClient, "maintenance_mode"),
  ]);

  if (leadError) {
    return (
      <div className="space-y-4 text-slate-100">
        <h1 className="text-3xl font-semibold">Unable to load leads</h1>
        <p className="text-sm text-rose-300">
          Supabase returned an error. Confirm the service role credentials and network reachability, then refresh.
        </p>
        {leadError.message ? <p className="text-xs text-rose-400">{leadError.message}</p> : null}
      </div>
    );
  }

  if (maintenanceError) {
    return (
      <div className="space-y-4 text-slate-100">
        <h1 className="text-3xl font-semibold">Unable to load runtime flags</h1>
        <p className="text-sm text-rose-300">
          Supabase returned an error while loading runtime flags. Double-check the service role key and try again.
        </p>
        {maintenanceError.message ? <p className="text-xs text-rose-400">{maintenanceError.message}</p> : null}
      </div>
    );
  }

  const leads: LeadWithActions[] = (leadRows ?? []).map((lead) => ({
    ...lead,
    lead_actions: Array.isArray(lead.lead_actions)
      ? [...lead.lead_actions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      : [],
  }));

  const leadsBySource = leads.reduce<{
    airnub: LeadWithActions[];
    speckit: LeadWithActions[];
  }>(
    (acc, lead) => {
      if (lead.source === "speckit") {
        acc.speckit.push(lead);
      } else {
        acc.airnub.push(lead);
      }
      return acc;
    },
    { airnub: [], speckit: [] }
  );

  const maintenanceEnabled =
    typeof maintenanceFlag?.value === "boolean" ? maintenanceFlag.value : process.env.MAINTENANCE_MODE === "true";

  return (
    <div className="space-y-10 text-slate-100">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/70">Airnub</p>
        <h1 className="text-4xl font-semibold tracking-tight">Remote operations</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Review inbound leads from both marketing sites, assign follow-ups, and toggle the maintenance banner without opening the
          cloud console.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Runtime controls</h2>
        <MaintenanceToggleForm
          enabled={maintenanceEnabled}
          updatedAt={maintenanceFlag?.updated_at}
          updatedBy={maintenanceFlag?.updated_by ?? null}
        />
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Inbound leads</h2>
          <p className="text-sm text-slate-300">Showing the 100 most recent submissions across the Airnub and Speckit funnels.</p>
        </div>

        {leads.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-800/60 bg-slate-950/40 p-6 text-sm text-slate-400">
            No leads yet. Check back after the next launch.
          </p>
        ) : null}

        {(["airnub", "speckit"] as const).map((source) => {
          const sourceLeads = leadsBySource[source];

          if (sourceLeads.length === 0) {
            return null;
          }

          const sourceLabel = source === "airnub" ? "Airnub marketing" : "Speckit marketing";

          return (
            <div key={source} className="space-y-4">
              <h3 className="text-lg font-semibold">{sourceLabel}</h3>
              <div className="grid gap-6 lg:grid-cols-2">
                {sourceLeads.map((lead) => {
                  const latestAction = lead.lead_actions.at(0);

                  return (
                    <article
                      key={lead.id}
                      className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-slate-800/70 bg-slate-950/60 p-6 shadow-lg shadow-slate-950/40"
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Submitted</p>
                          <p className="text-sm text-slate-200">{formatTimestamp(lead.created_at)}</p>
                        </div>
                        <div>
                          <h4 className="text-2xl font-semibold text-white">{lead.full_name ?? lead.email}</h4>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-sm text-sky-300 underline-offset-4 hover:underline"
                          >
                            {lead.email}
                          </a>
                          {lead.company ? (
                            <p className="text-sm text-slate-300">{lead.company}</p>
                          ) : null}
                        </div>
                        {lead.message ? (
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400">Message</p>
                            <p className="mt-1 whitespace-pre-line text-sm text-slate-200">{lead.message}</p>
                          </div>
                        ) : null}
                        {latestAction ? (
                          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-400">Latest triage</p>
                            <p className="mt-1 text-sm text-slate-200">
                              {STATUS_LABELS[latestAction.status] ?? latestAction.status}
                              {latestAction.assignee ? ` • Assigned to ${latestAction.assignee}` : ""}
                            </p>
                            {latestAction.note ? (
                              <p className="mt-2 text-sm text-slate-300 whitespace-pre-line">{latestAction.note}</p>
                            ) : null}
                            <p className="mt-2 text-xs text-slate-500">
                              {latestAction.created_by ? `${latestAction.created_by} — ` : ""}
                              {formatTimestamp(latestAction.created_at)}
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-800/60 bg-slate-900/20 p-4 text-sm text-slate-400">
                            No triage recorded yet.
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        {lead.lead_actions.length > 1 ? (
                          <div className="space-y-2">
                            <p className="text-xs uppercase tracking-wide text-slate-400">History</p>
                            <ul className="space-y-2 text-xs text-slate-400">
                              {lead.lead_actions.slice(1, 5).map((action) => (
                                <li key={action.id} className="rounded-xl border border-slate-800/60 bg-slate-900/30 p-3">
                                  <p className="text-slate-300">
                                    {STATUS_LABELS[action.status] ?? action.status}
                                    {action.assignee ? ` • ${action.assignee}` : ""}
                                  </p>
                                  {action.note ? <p className="mt-1 whitespace-pre-line text-slate-400">{action.note}</p> : null}
                                  <p className="mt-1 text-[0.7rem] text-slate-500">
                                    {action.created_by ? `${action.created_by} — ` : ""}
                                    {formatTimestamp(action.created_at)}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        <LeadActionForm
                          leadId={lead.id}
                          latestStatus={latestAction?.status}
                          latestAssignee={latestAction?.assignee ?? null}
                          actorSuggestion={latestAction?.created_by ?? null}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
