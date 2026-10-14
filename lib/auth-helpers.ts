import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  role: Role;
}

/**
 * Validates the current session inside admin pages and server actions.
 * Throws redirect to /admin/login if not authenticated.
 */
export async function requireAuth(): Promise<AuthenticatedAdmin> {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/admin/login");
  }

  return {
    id: session.user.id || "",
    email: session.user.email,
    role: ((session.user as { role?: string }).role as Role) || Role.STAFF,
  };
}

/**
 * Validates that the current user has the OWNER role.
 * OWNER can do everything, while STAFF can only view and update inquiries.
 * If user is STAFF or unauthenticated, redirects with a forbidden indicator.
 */
export async function requireOwner(): Promise<AuthenticatedAdmin> {
  const admin = await requireAuth();

  if (admin.role !== Role.OWNER) {
    redirect("/admin?error=forbidden");
  }

  return admin;
}

/**
 * Helper to check role permissions in UI components
 */
export function isOwner(role?: Role | string): boolean {
  return role === Role.OWNER || role === "OWNER";
}

export function canManagePackages(role?: Role | string): boolean {
  return isOwner(role);
}

export function canManageInquiries(role?: Role | string): boolean {
  return role === Role.OWNER || role === "OWNER" || role === Role.STAFF || role === "STAFF";
}
