"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export interface LoginActionState {
  error?: string;
  success?: boolean;
}

export async function loginAdmin(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const callbackUrl = (formData.get("callbackUrl") as string) || "/admin";

  if (!email || !password) {
    return {
      error: "Email or password is incorrect",
    };
  }

  try {
    await signIn("credentials", {
      email: String(email).trim().toLowerCase(),
      password: String(password),
      redirectTo: callbackUrl,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Email or password is incorrect",
      };
    }

    // Next.js redirect mechanism throws a NEXT_REDIRECT error which must be rethrown
    throw error;
  }
}

export async function logoutAdminAction() {
  await signOut({ redirectTo: "/admin/login" });
}
