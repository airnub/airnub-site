---
id: remote-operations
title: Remote operations guide
sidebar_position: 5
---
This note captures which parts of the Airnub marketing stack can already be operated without
opening the cloud console and highlights a few high-value additions to prioritize.

## What you can control today

- **Remote operations console:** Visit `/admin/leads` (protected by Supabase Auth) to review the
  latest 100 leads from both Airnub and Speckit, assign owners, add notes, and view each triage
  history. The admin layout checks the Supabase session on every request while the sign-in flow
  issues HttpOnly cookies via `@supabase/ssr`, so no credentials ever land in the browser.【F:apps/airnub/app/admin/(protected)/leads/page.tsx†L1-L213】【F:apps/airnub/app/admin/(protected)/layout.tsx†L1-L65】【F:apps/airnub/app/admin/(public)/sign-in/actions.ts†L1-L32】
- **Maintenance banner toggle:** The admin console persists a `maintenance_mode` runtime flag in
  Supabase. The public site consults the cached flag on every request (falling back to the
  `MAINTENANCE_MODE` env var) so you can flip the banner from your phone without redeploying.【F:apps/airnub/lib/runtime-flags.ts†L1-L31】【F:apps/airnub/app/[locale]/layout.tsx†L1-L128】【F:apps/airnub/app/admin/(protected)/leads/MaintenanceToggleForm.tsx†L1-L85】
- **Inbound leads ingestion:** Both marketing sites post their contact forms through the `submitLead`
  server action into the shared `contact_leads` table. Thanks to Supabase row-level security,
  anonymous users can only insert rows; reads require the service role key, which means the admin
  console is the approved way to review submissions.【F:apps/airnub/app/[locale]/contact/actions.ts†L1-L56】【F:supabase/migrations/20240718000000_create_contact_leads.sql†L1-L22】

## High-value upgrades for on-the-road operations

1. **Quick replies & integrations.** Embed `mailto:` and deep links into your CRM or helpdesk, or
   trigger a server action that sends templated responses via your transactional email provider.
   Storing the outbound email ID alongside the action record makes handoffs auditable when you're
   back at a laptop.
2. **Self-healing connectivity checks.** Implement a lightweight background job (Edge Function or
   cron) that pings Supabase using the service role and raises an alert (Slack, SMS) when inserts or
   reads fail. Pair it with a simple status widget in the admin view so you can confirm the API is
   reachable before re-running a form submission.
3. **Cache & ISR refresh endpoint.** Expose a protected API route that calls `revalidatePath` or
   `resend` to invalidate stale ISR caches after content edits. That gives you a remote "soft
   restart" lever without redeploying the app when marketing content updates or a Supabase hiccup
   clears.
4. **Feature-flag toggles beyond maintenance.** Expand the `runtime_flags` table with additional
   keys (e.g., "pause forms", "switch hero CTA") so marketing can flip experiments without a
  redeploy. The admin console already knows how to persist and revalidate those values; it just
  needs additional form controls.【F:supabase/migrations/20240725000000_create_lead_actions_and_runtime_flags.sql†L1-L33】【F:apps/airnub/app/admin/(protected)/leads/actions.ts†L1-L87】

## Provisioning Supabase admin access

Follow these steps to create a console user directly in the Supabase dashboard:

1. Open your project in [Supabase](https://supabase.com/), then navigate to **Authentication →
   Users** and click **Add user**.
2. Enter the admin's email address and a strong password. Check **Auto-confirm user** so the
   account can sign in immediately without email confirmation.
3. (Optional) Add a note in the user's metadata describing the role, e.g., `{ "role": "admin" }`
   so you can audit access later.
4. Share the credentials out-of-band. The admin can now sign in at
   `https://your-airnub-domain/admin/sign-in`, and the Supabase session cookie will unlock the
   protected operations console.【F:apps/airnub/app/admin/(public)/sign-in/page.tsx†L1-L28】

These additions keep day-to-day operations inside the product surface you already control, so you
can stay effective on the road while reserving the cloud console for deeper incident response.
