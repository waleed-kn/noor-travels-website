import React from "react";
import Link from "next/link";
import { requireAuth, isOwner } from "@/lib/auth-helpers";
import prisma from "@/lib/db";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Card } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import { InquiryStatus, RoomType } from "@prisma/client";
import {
  Inbox,
  Calendar,
  Package,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldAlert,
  Users,
  CheckCircle2,
  Phone,
  Eye,
} from "lucide-react";

interface AdminDashboardProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

function isRealDatabaseConfigured(): boolean {
  const dbUrl = process.env.DATABASE_URL;
  return Boolean(dbUrl && !dbUrl.includes("ep-sample") && !dbUrl.includes("placeholder"));
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardProps) {
  // Call auth() / requireAuth() on every admin page
  const admin = await requireAuth();
  const { error } = await searchParams;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let newInquiriesCount = 0;
  let inquiriesThisMonthCount = 0;
  let publishedPackagesCount = 0;
  let latestInquiries: Array<{
    id: string;
    name: string;
    phone: string;
    email: string | null;
    roomType: RoomType | null;
    adults: number;
    children: number;
    infants: number;
    status: InquiryStatus;
    createdAt: Date;
    message: string | null;
    packageTitle?: string | null;
  }> = [];

  if (isRealDatabaseConfigured()) {
    try {
      const [newCount, monthCount, pubPackCount, inquiries] = await Promise.all([
        prisma.inquiry.count({
          where: { status: InquiryStatus.NEW },
        }),
        prisma.inquiry.count({
          where: { createdAt: { gte: startOfMonth } },
        }),
        prisma.package.count({
          where: { isPublished: true, archivedAt: null },
        }),
        prisma.inquiry.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            package: {
              select: { title: true },
            },
          },
        }),
      ]);

      newInquiriesCount = newCount;
      inquiriesThisMonthCount = monthCount;
      publishedPackagesCount = pubPackCount;
      latestInquiries = inquiries.map((iq) => ({
        ...iq,
        packageTitle: iq.package?.title,
      }));
    } catch (err) {
      console.error("Database query failed on admin dashboard:", err);
    }
  } else {
    // Dev fallback mock data for testing environment without live DB
    newInquiriesCount = 2;
    inquiriesThisMonthCount = 5;
    publishedPackagesCount = 3;
    latestInquiries = [
      {
        id: "mock-1",
        name: "Haji Muhammad Tariq",
        phone: "03129998877",
        email: "tariq@example.com",
        roomType: RoomType.QUAD,
        adults: 3,
        children: 1,
        infants: 0,
        status: InquiryStatus.NEW,
        createdAt: new Date(),
        message: "Need ground floor rooms in Makkah for elderly parents.",
        packageTitle: "Arafat Zabhi & Hala Taiba - 20 Days",
      },
      {
        id: "mock-2",
        name: "Zubair Ahmad",
        phone: "03005544332",
        email: "zubair@example.com",
        roomType: RoomType.SHARING,
        adults: 2,
        children: 0,
        infants: 0,
        status: InquiryStatus.NEW,
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
        message: null,
        packageTitle: "That Hotel & Diyar Al Safa - 20 Days",
      },
      {
        id: "mock-3",
        name: "Bilal Khattak",
        phone: "03339182736",
        email: null,
        roomType: RoomType.DOUBLE,
        adults: 2,
        children: 0,
        infants: 1,
        status: InquiryStatus.CONTACTED,
        createdAt: new Date(Date.now() - 14 * 3600 * 1000),
        message: "Traveling with 6-month-old infant.",
        packageTitle: "Rukan Al Zawai & Essa Karim - 20 Days",
      },
    ];
  }

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case InquiryStatus.NEW:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            NEW
          </span>
        );
      case InquiryStatus.CONTACTED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            CONTACTED
          </span>
        );
      case InquiryStatus.CONFIRMED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            CONFIRMED
          </span>
        );
      case InquiryStatus.CLOSED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            CLOSED
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Access Denied / Error Banner if redirected from unauthorized route */}
      {error === "forbidden" && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 shadow-xs"
        >
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-red-900">
              Access Restricted
            </h4>
            <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
              Package management requires Owner privileges. Staff accounts may only view and update inquiries.
            </p>
          </div>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border">
        <div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-sand text-gold-dark text-[11px] font-bold uppercase tracking-wider mb-1">
            Overview
          </span>
          <h1 className="font-display text-3xl font-bold text-navy">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-navy-deep/70 mt-0.5">
            Welcome back, <span className="font-semibold text-navy">{admin.email}</span> ({admin.role})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-semibold shadow-xs transition-all active:scale-98"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>View All Inquiries</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards (New inquiries, Total inquiries this month, Published packages) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: New Inquiries */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-navy/60">
              New Inquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-gold-dark flex items-center justify-center border border-amber-200/60">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-navy font-display">
              {newInquiriesCount}
            </span>
          </div>
          <p className="text-xs text-navy-deep/60 mt-1 flex items-center gap-1">
            <span>Awaiting initial response</span>
          </p>
        </div>

        {/* Card 2: Total Inquiries This Month */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-navy/60">
              Inquiries This Month
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-navy flex items-center justify-center border border-blue-200/60">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-navy font-display">
              {inquiriesThisMonthCount}
            </span>
          </div>
          <p className="text-xs text-navy-deep/60 mt-1">
            <span>Since {startOfMonth.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </p>
        </div>

        {/* Card 3: Published Packages */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-navy/60">
              Published Packages
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-navy font-display">
              {publishedPackagesCount}
            </span>
          </div>
          <p className="text-xs text-navy-deep/60 mt-1">
            <span>Active on public website</span>
          </p>
        </div>
      </div>

      {/* List of 5 Latest Inquiries */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-navy">
              Latest Inquiries
            </h2>
            <p className="text-xs text-navy-deep/70 mt-0.5">
              The 5 most recent pilgrim inquiries received online.
            </p>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs font-semibold text-gold-dark hover:text-navy transition-colors inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {latestInquiries.length === 0 ? (
          <div className="p-12 text-center text-sm text-navy-deep/60">
            No inquiries recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-sand/30 text-navy uppercase text-[11px] font-bold tracking-wider border-b border-border">
                <tr>
                  <th scope="col" className="py-3 px-4 sm:px-6">Traveler</th>
                  <th scope="col" className="py-3 px-4">Contact</th>
                  <th scope="col" className="py-3 px-4">Package / Room</th>
                  <th scope="col" className="py-3 px-4">Group</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4">Received</th>
                  <th scope="col" className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {latestInquiries.map((iq) => {
                  const replyWa = buildWhatsAppLink({
                    phone: iq.phone,
                    message: `Assalam o Alaikum ${iq.name}, thank you for contacting Noor Travels regarding your Umrah inquiry. How can we assist you today?`,
                  });

                  return (
                    <tr key={iq.id} className="hover:bg-sand/15 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="font-bold text-navy block text-sm">
                          {iq.name}
                        </span>
                        {iq.email && (
                          <span className="text-[11px] text-navy-deep/60 block">
                            {iq.email}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-medium text-navy block">
                          {iq.phone}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-navy block truncate max-w-[180px]">
                          {iq.packageTitle || "General Inquiry"}
                        </span>
                        <span className="text-[11px] text-navy-deep/60 block">
                          {iq.roomType ? `${iq.roomType} room` : "Flexible room"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-navy font-semibold">
                          {iq.adults}A
                          {iq.children > 0 && ` + ${iq.children}C`}
                          {iq.infants > 0 && ` + ${iq.infants}I`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(iq.status)}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-navy-deep/60 whitespace-nowrap">
                        {iq.createdAt.toLocaleDateString("en-PK", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={replyWa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold shadow-2xs transition-all active:scale-95"
                          title="Chat on WhatsApp"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
