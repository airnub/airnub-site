"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button, FormMessage, useToast } from "@airnub/ui";
import type { LeadFormState } from "./actions";

export type ContactFormLabels = {
  name: string;
  email: string;
  company: string;
  focus: string;
  emailRequiredSuffix: string;
  required: string;
  submit: string;
  success: {
    title: string;
    description: string;
  };
  error: {
    title: string;
    description: string;
  };
  validation: {
    email: string;
  };
};

type ContactFormProps = {
  action: (state: LeadFormState, formData: FormData) => Promise<LeadFormState>;
  initialState: LeadFormState;
  labels: ContactFormLabels;
  toastDismissLabel: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending} className="min-w-[10rem] justify-center">
      {pending ? `${label}…` : label}
    </Button>
  );
}

export function ContactForm({ action, initialState, labels, toastDismissLabel }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { notify } = useToast();
  const [state, formAction] = useActionState(action, initialState);
  const previousStatus = useRef<LeadFormState["status"]>(initialState.status);

  const successTitle = labels.success.title;
  const successDescription = labels.success.description;
  const errorTitle = labels.error.title;
  const errorDescription = labels.error.description;
  const emailValidationMessage = labels.validation.email;

  useEffect(() => {
    if (previousStatus.current === state.status) {
      return;
    }

    previousStatus.current = state.status;

    if (state.status === "success") {
      notify({
        title: successTitle,
        description: successDescription,
        variant: "success",
        closeLabel: toastDismissLabel,
      });
      formRef.current?.reset();
    } else if (state.status === "error") {
      const description = state.errors?.email ? emailValidationMessage : state.message ?? errorDescription;
      notify({
        title: errorTitle,
        description,
        variant: "error",
        closeLabel: toastDismissLabel,
      });
    }
  }, [state, successTitle, successDescription, errorTitle, errorDescription, emailValidationMessage, notify, toastDismissLabel]);

  const emailErrorId = state.errors?.email ? "contact-email-error" : undefined;
  const emailErrorMessage = useMemo(() => {
    if (!state.errors?.email) {
      return undefined;
    }
    if (state.errors.email === "validation.email") {
      return emailValidationMessage;
    }
    return errorDescription;
  }, [state.errors, emailValidationMessage, errorDescription]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-foreground">
            {labels.name}
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            className="mt-2 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-foreground">
            {labels.email}{" "}
            <span className="text-rose-400" aria-hidden="true">
              {labels.emailRequiredSuffix}
            </span>
            <span className="sr-only">({labels.required})</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-describedby={emailErrorId}
            className="mt-2 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {emailErrorMessage ? (
            <FormMessage id={emailErrorId} variant="error" className="mt-3 text-sm font-medium">
              {emailErrorMessage}
            </FormMessage>
          ) : null}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-foreground">
            {labels.company}
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className="mt-2 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-foreground">
            {labels.focus}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-2 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      {state.status === "success" ? (
        <FormMessage variant="success" className="mt-4 text-sm font-medium">
          {successDescription}
        </FormMessage>
      ) : null}
      {state.status === "error" && !state.errors?.email ? (
        <FormMessage variant="error" className="mt-4 text-sm font-medium">
          {state.message ?? errorDescription}
        </FormMessage>
      ) : null}
      <div className="pt-2">
        <SubmitButton label={labels.submit} />
      </div>
    </form>
  );
}
