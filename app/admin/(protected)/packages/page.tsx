import React from "react";
import Link from "next/link";
import { requireOwner } from "@/lib/auth-helpers";
import prisma from "@/lib/db";
import { getPublishedPackages } from "@/lib/queries";
import { money } from "@/lib/format";
import { PackageStatus } from "@prisma/client";
import { Package, Plus, Calendar, MapPin, CheckCircle, Clock } from "lucide-react";

function isRealDatabaseConfigured(): boolean {
  const dbUrl = process.env.DATABASE_URL;
  return Boolean(dbUrl && !dbUrl.includes("ep-sample") && !dbUrl.includes("placeholder"));
}

export default async function AdminPackagesPage() {
  // CRITICAL: requireOwner blocks STAFF users from accessing package management!
  // If role is not OWNER, redirects to /admin?error=forbidden
  const admin = await requireOwner();

  let packages: Array<{
    id: string;
    slug: string;
    title: string;
    durationDays: number;
    departureCity: string;
    departureDate: Date;
    airline: string;
    status: PackageStatus;
    isPublished: boolean;
  }> = [];

  if (isRealDatabaseConfigured()) {
    try {
      packages = await prisma.package.findMany({
        where: { archivedAt: null },
        orderBy: [{ sortOrder: "asc" }, { departureDate: "asc" }],
      });
    } catch (err) {
      console.error("Database query failed in admin packages:", err);
    }
  } else {
    // Dev fallback mock packages
    packages = [
      {
        id: "pkg-1",
        slug: "arafat-zabhi-20-days",
        title: "Arafat Zabhi & Hala Taiba - 20 Days",
        durationDays: 20,
        departureCity: "Peshawar",
        departureDate: new Date("2026-10-03"),
        airline: "Qatar Airways",
        status: PackageStatus.OPEN,
        isPublished: true,
      },
      {
        id: "pkg-2",
        slug: "that-hotel-20-days",
        title: "That Hotel & Diyar Al Safa - 20 Days",
        durationDays: 20,
        departureCity: "Peshawar",
        departureDate: new Date("2026-10-03"),
        airline: "Qatar Airways",
        status: PackageStatus.OPEN,
        isPublished: true,
      },
      {
        id: "pkg-3",
        slug: "rukan-al-zawai-20-days",
        title: "Rukan Al Zawai & Essa Karim - 20 Days",
        durationDays: 20,
        departureCity: "Peshawar",
        departureDate: new Date("2026-10-03"),
        airline: "Qatar Airways",
        status: PackageStatus.OPEN,
        isPublished: true,
      },
    ];
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-sand text-gold-dark text-[11px] font-bold uppercase tracking-wider mb-1">
            Owner Only
          </span>
          <h1 className="font-display text-3xl font-bold text-navy">
            Package Management
          </h1>
          <p className="text-xs sm:text-sm text-navy-deep/70 mt-0.5">
            Manage Umrah pilgrimage packages, flights, hotels, and seat availability.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-navy">
            All Packages ({packages.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-sand/30 text-navy uppercase text-[11px] font-bold tracking-wider border-b border-border">
              <tr>
                <th scope="col" className="py-3 px-4 sm:px-6">Package Name</th>
                <th scope="col" className="py-3 px-4">Duration &amp; Departure</th>
                <th scope="col" className="py-3 px-4">Airline</th>
                <th scope="col" className="py-3 px-4">Status</th>
                <th scope="col" className="py-3 px-4 text-right">View Public</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-sand/15 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-bold text-navy block text-sm">
                      {pkg.title}
                    </span>
                    <span className="text-xs text-navy-deep/60 font-mono">
                      /{pkg.slug}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-navy block">
                      {pkg.durationDays} Days from {pkg.departureCity}
                    </span>
                    <span className="text-xs text-navy-deep/60 block">
                      {pkg.departureDate.toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-semibold text-navy">
                      {pkg.airline}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        pkg.status === PackageStatus.OPEN
                          ? "bg-emerald-100 text-emerald-800"
                          : pkg.status === PackageStatus.FEW_SEATS
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      href={`/packages/${pkg.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-bold text-gold-dark hover:text-navy underline"
                    >
                      Preview Page
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
