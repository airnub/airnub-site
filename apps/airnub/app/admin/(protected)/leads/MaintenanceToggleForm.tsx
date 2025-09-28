"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
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
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-500"
      disabled={pending}
    >
      {pending ? "Saving…" : "Save maintenance setting"}
    </button>
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
      className="space-y-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4"
    >
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Maintenance mode</label>
        <select
          name="enabled"
          defaultValue={String(enabled)}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="false" className="bg-slate-950 text-slate-900">
            Off — public site stays live
          </option>
          <option value="true" className="bg-slate-950 text-slate-900">
            On — show downtime banner everywhere
          </option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr,1fr]">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Recorded by</label>
          <input
            type="text"
            name="actor"
            placeholder="Your name"
            defaultValue={updatedBy ?? ""}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div className="text-xs text-slate-400">
          <p className="font-semibold uppercase tracking-wide">Last updated</p>
          <p className="mt-2 text-slate-300">
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
