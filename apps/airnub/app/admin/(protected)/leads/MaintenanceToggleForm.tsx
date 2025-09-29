"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@airnub/ui";
import type { MaintenanceFormState } from "./actions";
import { updateMaintenanceMode } from "./actions";

type MaintenanceToggleFormProps = {
  enabled: boolean;
  updatedAt?: string;
  updatedBy?: string | null;
};

const initialState: MaintenanceFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-disabled={pending} className="min-w-[12rem] justify-center">
      {pending ? "Saving…" : "Save maintenance setting"}
    </Button>
  );
}

export function MaintenanceToggleForm({ enabled, updatedAt, updatedBy }: MaintenanceToggleFormProps) {
  const [state, formAction] = useFormState(updateMaintenanceMode, initialState);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const formattedUpdatedAt = updatedAt ? new Date(updatedAt).toLocaleString(undefined, { hour12: false }) : null;

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4"
    >
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Maintenance mode</label>
        <select
          name="enabled"
          defaultValue={String(enabled)}
          className="mt-2 w-full rounded-xl border border-border bg-card/60 px-3 py-2 text-sm text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="false">
            Off — public site stays live
          </option>
          <option value="true">
            On — show downtime banner everywhere
          </option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr,1fr]">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recorded by</label>
          <input
            type="text"
            name="actor"
            placeholder="Your name"
            defaultValue={updatedBy ?? ""}
            className="mt-2 w-full rounded-xl border border-border bg-card/60 px-3 py-2 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          <p className="font-semibold uppercase tracking-wide">Last updated</p>
          <p className="mt-2 text-muted-foreground">
            {formattedUpdatedAt ? formattedUpdatedAt : "No changes yet"}
            {updatedBy ? ` • ${updatedBy}` : ""}
          </p>
        </div>
      </div>
      {state.status === "error" ? (
        <p className="text-sm text-rose-400">{state.message ?? "Unable to save."}</p>
      ) : null}
      {state.status === "success" ? (
        <p className="text-sm text-emerald-400">{state.message ?? "Saved."}</p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
