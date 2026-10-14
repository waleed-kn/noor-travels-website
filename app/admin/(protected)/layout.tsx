import React from "react";
import { requireAuth } from "@/lib/auth-helpers";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { IdleTimer } from "@/components/admin/IdleTimer";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce session validation inside admin layout as required
  const admin = await requireAuth();

  return (
    <div className="min-h-screen bg-sand/20">
      {/* 30-minute inactivity auto-logout */}
      <IdleTimer />

      {/* Sidebar Navigation (Desktop & Mobile) */}
      <AdminSidebar user={admin} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
