import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Login | Noor Travels",
  description: "Secure administrative portal for Noor Travels management.",
  robots: {
    index: false,
    follow: false,
  },
};

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    reason?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  // If already authenticated, redirect to /admin directly
  if (session?.user) {
    redirect("/admin");
  }

  const { callbackUrl, reason } = await searchParams;

  return (
    <div className="min-h-screen bg-sand/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-block hover:opacity-90 transition-opacity mb-4">
          <Logo />
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand text-gold-dark text-xs font-bold uppercase tracking-wider mb-2">
          <Shield className="w-3.5 h-3.5 text-gold" />
          <span>Management Portal</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-navy">
          Admin Sign In
        </h1>
        <p className="mt-1 text-xs text-navy-deep/70">
          Enter your authorized Noor Travels credentials to continue.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-sm rounded-2xl border border-border">
          <LoginForm callbackUrl={callbackUrl} reason={reason} />
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-navy-deep/70 hover:text-navy transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Noor Travels homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
