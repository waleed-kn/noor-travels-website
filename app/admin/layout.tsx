import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | Noor Travels",
  description: "Management dashboard for Noor Travels.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-sand/20 text-navy-deep">{children}</div>;
}
