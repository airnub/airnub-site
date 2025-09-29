"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@airnub/ui";
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
    <Button type="submit" disabled={pending} aria-disabled={pending} className="min-w-[8rem] justify-center">
      {pending ? "Saving…" : label}
    </Button>
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
      className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4"
    >
      <input type="hidden" name="leadId" value={leadId} />
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
        <select
          name="status"
          defaultValue={latestStatus && LEAD_STATUSES.includes(latestStatus as any) ? latestStatus : "new"}
          className="mt-2 w-full rounded-xl border border-border bg-card/60 px-3 py-2 text-sm text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {LEAD_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assign to</label>
          <input
            type="text"
            name="assignee"
            placeholder="Owner or teammate"
            defaultValue={latestAssignee ?? ""}
            className="mt-2 w-full rounded-xl border border-border bg-card/60 px-3 py-2 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recorded by</label>
          <input
            type="text"
            name="actor"
            placeholder="Your name"
            defaultValue={actorSuggestion ?? ""}
            className="mt-2 w-full rounded-xl border border-border bg-card/60 px-3 py-2 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</label>
        <textarea
          name="note"
          rows={3}
          placeholder="Context, reply summary, or next steps"
          className="mt-2 w-full rounded-xl border border-border bg-card/60 px-3 py-2 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
