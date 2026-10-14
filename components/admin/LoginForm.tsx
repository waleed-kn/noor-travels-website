"use client";

import React, { useActionState, useTransition } from "react";
import { loginAdmin, LoginActionState } from "@/app/actions/auth";
import { Field, Button } from "@/components/ui";
import { Lock, Mail, AlertCircle, ShieldAlert } from "lucide-react";

interface LoginFormProps {
  callbackUrl?: string;
  reason?: string;
}

export function LoginForm({ callbackUrl = "/admin", reason }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAdmin, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {reason === "idle" && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>You have been automatically logged out due to 30 minutes of inactivity.</span>
        </div>
      )}

      {state.error && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2 animate-fadeIn"
        >
          <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="font-medium">{state.error}</span>
        </div>
      )}

      <Field
        id="admin-email"
        name="email"
        type="email"
        label="Admin Email"
        placeholder="admin@noortravels.pk"
        required
        disabled={isPending}
        autoComplete="email"
      />

      <Field
        id="admin-password"
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••••••"
        required
        disabled={isPending}
        autoComplete="current-password"
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="md"
          isLoading={isPending}
          disabled={isPending}
        >
          <Lock className="w-4 h-4 mr-1.5" />
          <span>{isPending ? "Authenticating..." : "Sign in to Dashboard"}</span>
        </Button>
      </div>

      <p className="text-[11px] text-navy-deep/60 text-center pt-2">
        Protected admin portal with automated rate-limiting &amp; lockout protection.
      </p>
    </form>
  );
}
