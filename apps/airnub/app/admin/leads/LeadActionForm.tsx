"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { LeadActionFormState } from "./actions";
import { submitLeadAction } from "./actions";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "./statuses";

type LeadActionFormProps = {
  leadId: string;
  latestStatus?: string;
  latestAssignee?: string | null;
  actorSuggestion?: string | null;
};

const initialState: LeadActionFormState = { status: "idle" };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:bg-slate-500"
      disabled={pending}
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function LeadActionForm({ leadId, latestStatus, latestAssignee, actorSuggestion }: LeadActionFormProps) {
  const [state, formAction] = useFormState(submitLeadAction, initialState);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4"
    >
      <input type="hidden" name="leadId" value={leadId} />
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Status</label>
        <select
          name="status"
          defaultValue={latestStatus && LEAD_STATUSES.includes(latestStatus as any) ? latestStatus : "new"}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status} className="bg-slate-950 text-slate-900">
              {LEAD_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Assign to</label>
          <input
            type="text"
            name="assignee"
            placeholder="Owner or teammate"
            defaultValue={latestAssignee ?? ""}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Recorded by</label>
          <input
            type="text"
            name="actor"
            placeholder="Your name"
            defaultValue={actorSuggestion ?? ""}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</label>
        <textarea
          name="note"
          rows={3}
          placeholder="Context, reply summary, or next steps"
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>
      {state.status === "error" ? (
        <p className="text-sm text-rose-400">{state.message ?? "Unable to save."}</p>
      ) : null}
      {state.status === "success" ? (
        <p className="text-sm text-emerald-400">{state.message ?? "Saved."}</p>
      ) : null}
      <SubmitButton label="Save triage" />
    </form>
  );
}
