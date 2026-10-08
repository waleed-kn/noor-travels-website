import prisma from "@/lib/db";
import { PackageStatus, Prisma } from "@prisma/client";

export interface PackageFilters {
  status?: PackageStatus | string;
  departureCity?: string;
  airline?: string;
  minPrice?: number;
  maxPrice?: number;
  month?: string;
}

const packageIncludes = {
  flightLegs: {
    orderBy: { sortOrder: "asc" as const },
  },
  hotelStays: true,
  prices: {
    orderBy: { amount: "asc" as const },
  },
  childPricing: true,
};

export type PackageWithRelations = Prisma.PackageGetPayload<{
  include: typeof packageIncludes;
}>;

/**
 * Calculates the lowest room price for a package.
 */
export function getLowestPrice(pkg: PackageWithRelations): number {
  if (!pkg.prices || pkg.prices.length === 0) return 0;
  return Math.min(...pkg.prices.map((p) => p.amount));
}

/**
 * Formats a Date to a YYYY-MM string based on UTC.
 */
export function getYearMonthString(date: Date | string): string {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function hasConfiguredDb(): boolean {
  const dbUrl = process.env.DATABASE_URL;
  return Boolean(dbUrl && !dbUrl.includes("ep-sample") && !dbUrl.includes("placeholder"));
}

/**
 * Returns all published, non-archived Umrah packages matching optional filters.
 */
export async function getPublishedPackages(filters?: PackageFilters): Promise<PackageWithRelations[]> {
  let packages: PackageWithRelations[] = [];

  if (hasConfiguredDb()) {
    try {
      const where: Prisma.PackageWhereInput = {
        isPublished: true,
        archivedAt: null,
      };

      if (filters?.status && (filters.status === "OPEN" || filters.status === "FEW_SEATS" || filters.status === "CLOSED")) {
        where.status = filters.status as PackageStatus;
      }

      if (filters?.departureCity) {
        where.departureCity = {
          contains: filters.departureCity,
          mode: "insensitive",
        };
      }

      if (filters?.airline) {
        where.airline = {
          contains: filters.airline,
          mode: "insensitive",
        };
      }

      packages = await prisma.package.findMany({
        where,
        include: packageIncludes,
        orderBy: [{ sortOrder: "asc" }, { departureDate: "asc" }],
      });
    } catch (error) {
      console.error("Database query failed in getPublishedPackages:", error);
      packages = [];
    }
  }

  // If database returns empty (e.g. sample db credentials or initial dev setup), fallback to mockup packages
  if (packages.length === 0) {
    packages = getMockupPackages().filter((p) => p.isPublished && !p.archivedAt);
  }

  // Apply filters in-memory for precise lowest room price and departure month matching
  if (filters?.status) {
    packages = packages.filter((p) => p.status === filters.status);
  }

  if (filters?.month) {
    packages = packages.filter((p) => getYearMonthString(p.departureDate) === filters.month);
  }

  if (filters?.minPrice !== undefined) {
    packages = packages.filter((p) => getLowestPrice(p) >= (filters.minPrice ?? 0));
  }

  if (filters?.maxPrice !== undefined) {
    packages = packages.filter((p) => getLowestPrice(p) <= (filters.maxPrice ?? Infinity));
  }

  // Ensure strict sort order: sortOrder asc, then departureDate asc
  packages.sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
  });

  return packages;
}

/**
 * Returns featured published, non-archived packages.
 */
export async function getFeaturedPackages(limit: number = 3): Promise<PackageWithRelations[]> {
  if (hasConfiguredDb()) {
    try {
      const pkgs = await prisma.package.findMany({
        where: {
          isPublished: true,
          isFeatured: true,
          archivedAt: null,
        },
        include: packageIncludes,
        orderBy: [{ sortOrder: "asc" }, { departureDate: "asc" }],
        take: limit,
      });
      if (pkgs.length > 0) return pkgs;
    } catch (error) {
      console.error("Database query failed in getFeaturedPackages:", error);
    }
  }

  return getMockupPackages()
    .filter((p) => p.isPublished && p.isFeatured && !p.archivedAt)
    .slice(0, limit);
}

/**
 * Returns a single published, non-archived package by its unique slug.
 */
export async function getPackageBySlug(slug: string): Promise<PackageWithRelations | null> {
  if (hasConfiguredDb()) {
    try {
      const pkg = await prisma.package.findFirst({
        where: {
          slug,
          isPublished: true,
          archivedAt: null,
        },
        include: packageIncludes,
      });
      if (pkg) return pkg;
    } catch (error) {
      console.error(`Database query failed in getPackageBySlug for ${slug}:`, error);
    }
  }

  return getMockupPackages().find((p) => p.slug === slug && p.isPublished && !p.archivedAt) || null;
}

/**
 * Seed mockup packages used for demo or testing verification when database has no published packages.
 */
export function getMockupPackages(): PackageWithRelations[] {
  return [
    {
      id: "pkg-1",
      slug: "arafat-zabhi-20-days",
      title: "Arafat Zabhi & Hala Taiba - 20 Days",
      durationDays: 20,
      departureCity: "Peshawar",
      departureDate: new Date("2026-10-03T04:05:00Z"),
      returnDate: new Date("2026-10-22T21:10:00Z"),
      airline: "Qatar Airways",
      status: "OPEN" as PackageStatus,
      isFeatured: true,
      isPublished: true,
      archivedAt: null,
      coverImage: "/package-default.jpg",
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      hotelStays: [
        {
          id: "hotel-1",
          packageId: "pkg-1",
          city: "MAKKAH",
          hotelName: "Arafat Zabhi",
          locationNote: "Umm Al Mounin Street, Kudai Shuttle Service",
          nights: "6+7",
          image: null,
        },
        {
          id: "hotel-2",
          packageId: "pkg-1",
          city: "MADINAH",
          hotelName: "Hala Taiba",
          locationNote: "Abdul Aziz Road, Shuttle Service",
          nights: "6",
          image: null,
        },
      ],
      flightLegs: [
        {
          id: "flight-1",
          packageId: "pkg-1",
          flightNo: "QR 601",
          route: "PEW-DOH",
          date: new Date("2026-10-03T04:05:00Z"),
          depTime: "04:05",
          arrTime: "06:05",
          sortOrder: 1,
        },
        {
          id: "flight-2",
          packageId: "pkg-1",
          flightNo: "QR 1248",
          route: "DOH-JED",
          date: new Date("2026-10-03T12:40:00Z"),
          depTime: "12:40",
          arrTime: "15:10",
          sortOrder: 2,
        },
        {
          id: "flight-3",
          packageId: "pkg-1",
          flightNo: "QR 1249",
          route: "JED-DOH",
          date: new Date("2026-10-22T16:40:00Z"),
          depTime: "16:40",
          arrTime: "19:00",
          sortOrder: 3,
        },
        {
          id: "flight-4",
          packageId: "pkg-1",
          flightNo: "QR 600",
          route: "DOH-PEW",
          date: new Date("2026-10-22T21:10:00Z"),
          depTime: "21:10",
          arrTime: "02:35",
          sortOrder: 4,
        },
      ],
      prices: [
        { id: "p-1", packageId: "pkg-1", roomType: "SHARING", amount: 231988 },
        { id: "p-2", packageId: "pkg-1", roomType: "QUAD", amount: 240044 },
        { id: "p-3", packageId: "pkg-1", roomType: "TRIPLE", amount: 250532 },
        { id: "p-4", packageId: "pkg-1", roomType: "DOUBLE", amount: 271508 },
      ],
      childPricing: {
        id: "cp-1",
        packageId: "pkg-1",
        infantPrice: 95000,
        childNoBedPrice: 195000,
        childBedDiscount: 20000,
      },
    },
    {
      id: "pkg-2",
      slug: "that-hotel-20-days",
      title: "That Hotel & Diyar Al Safa - 20 Days",
      durationDays: 20,
      departureCity: "Peshawar",
      departureDate: new Date("2026-10-18T04:05:00Z"),
      returnDate: new Date("2026-11-06T21:10:00Z"),
      airline: "Qatar Airways",
      status: "FEW_SEATS" as PackageStatus,
      isFeatured: true,
      isPublished: true,
      archivedAt: null,
      coverImage: "/package-default.jpg",
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      hotelStays: [
        {
          id: "hotel-3",
          packageId: "pkg-2",
          city: "MAKKAH",
          hotelName: "That Hotel",
          locationNote: "Misfalah Kubri, 800 Mtrs",
          nights: "6+7",
          image: null,
        },
        {
          id: "hotel-4",
          packageId: "pkg-2",
          city: "MADINAH",
          hotelName: "Diyar Al Safa Center",
          locationNote: "Masjid Bilal Side, 700-750 Mtrs",
          nights: "6",
          image: null,
        },
      ],
      flightLegs: [
        {
          id: "flight-2-1",
          packageId: "pkg-2",
          flightNo: "QR 601",
          route: "PEW-DOH",
          date: new Date("2026-10-18T04:05:00Z"),
          depTime: "04:05",
          arrTime: "06:05",
          sortOrder: 1,
        },
        {
          id: "flight-2-2",
          packageId: "pkg-2",
          flightNo: "QR 1248",
          route: "DOH-JED",
          date: new Date("2026-10-18T12:40:00Z"),
          depTime: "12:40",
          arrTime: "15:10",
          sortOrder: 2,
        },
        {
          id: "flight-2-3",
          packageId: "pkg-2",
          flightNo: "QR 1249",
          route: "JED-DOH",
          date: new Date("2026-11-06T16:40:00Z"),
          depTime: "16:40",
          arrTime: "19:00",
          sortOrder: 3,
        },
        {
          id: "flight-2-4",
          packageId: "pkg-2",
          flightNo: "QR 600",
          route: "DOH-PEW",
          date: new Date("2026-11-06T21:10:00Z"),
          depTime: "21:10",
          arrTime: "02:35",
          sortOrder: 4,
        },
      ],
      prices: [
        { id: "p-5", packageId: "pkg-2", roomType: "SHARING", amount: 252052 },
        { id: "p-6", packageId: "pkg-2", roomType: "QUAD", amount: 260070 },
        { id: "p-7", packageId: "pkg-2", roomType: "TRIPLE", amount: 277233 },
        { id: "p-8", packageId: "pkg-2", roomType: "DOUBLE", amount: 311560 },
      ],
      childPricing: {
        id: "cp-2",
        packageId: "pkg-2",
        infantPrice: 95000,
        childNoBedPrice: 195000,
        childBedDiscount: 20000,
      },
    },
    {
      id: "pkg-3",
      slug: "rukan-al-zawai-20-days",
      title: "Rukan Al Zawai & Essa Karim - 20 Days",
      durationDays: 20,
      departureCity: "Peshawar",
      departureDate: new Date("2026-11-05T04:05:00Z"),
      returnDate: new Date("2026-11-24T21:10:00Z"),
      airline: "Qatar Airways",
      status: "CLOSED" as PackageStatus,
      isFeatured: true,
      isPublished: true,
      archivedAt: null,
      coverImage: "/package-default.jpg",
      sortOrder: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      hotelStays: [
        {
          id: "hotel-5",
          packageId: "pkg-3",
          city: "MAKKAH",
          hotelName: "Rukan Al Zawai",
          locationNote: "Ibrahim Khalil Road, 700-800 Mtrs",
          nights: "6+7",
          image: null,
        },
        {
          id: "hotel-6",
          packageId: "pkg-3",
          city: "MADINAH",
          hotelName: "Essa Karim",
          locationNote: "Old Dream Madinah Albaik, Oppo Side 600 Mtrs",
          nights: "6",
          image: null,
        },
      ],
      flightLegs: [
        {
          id: "flight-3-1",
          packageId: "pkg-3",
          flightNo: "QR 601",
          route: "PEW-DOH",
          date: new Date("2026-11-05T04:05:00Z"),
          depTime: "04:05",
          arrTime: "06:05",
          sortOrder: 1,
        },
        {
          id: "flight-3-2",
          packageId: "pkg-3",
          flightNo: "QR 1248",
          route: "DOH-JED",
          date: new Date("2026-11-05T12:40:00Z"),
          depTime: "12:40",
          arrTime: "15:10",
          sortOrder: 2,
        },
        {
          id: "flight-3-3",
          packageId: "pkg-3",
          flightNo: "QR 1249",
          route: "JED-DOH",
          date: new Date("2026-11-24T16:40:00Z"),
          depTime: "16:40",
          arrTime: "19:00",
          sortOrder: 3,
        },
        {
          id: "flight-3-4",
          packageId: "pkg-3",
          flightNo: "QR 600",
          route: "DOH-PEW",
          date: new Date("2026-11-24T21:10:00Z"),
          depTime: "21:10",
          arrTime: "02:35",
          sortOrder: 4,
        },
      ],
      prices: [
        { id: "p-9", packageId: "pkg-3", roomType: "SHARING", amount: 268800 },
        { id: "p-10", packageId: "pkg-3", roomType: "QUAD", amount: 280000 },
        { id: "p-11", packageId: "pkg-3", roomType: "TRIPLE", amount: 298500 },
        { id: "p-12", packageId: "pkg-3", roomType: "DOUBLE", amount: 335000 },
      ],
      childPricing: {
        id: "cp-3",
        packageId: "pkg-3",
        infantPrice: 95000,
        childNoBedPrice: 195000,
        childBedDiscount: 20000,
      },
    },
    {
      id: "pkg-4",
      slug: "safwah-royale-15-days",
      title: "Al Safwah Royale & Dar Al Taqwa - 15 Days",
      durationDays: 15,
      departureCity: "Peshawar",
      departureDate: new Date("2026-11-20T04:05:00Z"),
      returnDate: new Date("2026-12-04T21:10:00Z"),
      airline: "Saudia Airlines",
      status: "OPEN" as PackageStatus,
      isFeatured: false,
      isPublished: true,
      archivedAt: null,
      coverImage: "/package-default.jpg",
      sortOrder: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      hotelStays: [
        {
          id: "hotel-7",
          packageId: "pkg-4",
          city: "MAKKAH",
          hotelName: "Safwah Royale Orchid",
          locationNote: "Abraj Al Bait (Clock Tower) Front",
          nights: "7",
          image: null,
        },
        {
          id: "hotel-8",
          packageId: "pkg-4",
          city: "MADINAH",
          hotelName: "Dar Al Taqwa Hotel",
          locationNote: "Central Northern Haram Courtyard Front",
          nights: "7",
          image: null,
        },
      ],
      flightLegs: [
        {
          id: "flight-4-1",
          packageId: "pkg-4",
          flightNo: "SV 797",
          route: "PEW-JED",
          date: new Date("2026-11-20T09:30:00Z"),
          depTime: "09:30",
          arrTime: "13:45",
          sortOrder: 1,
        },
        {
          id: "flight-4-2",
          packageId: "pkg-4",
          flightNo: "SV 796",
          route: "MED-PEW",
          date: new Date("2026-12-04T15:00:00Z"),
          depTime: "15:00",
          arrTime: "22:15",
          sortOrder: 2,
        },
      ],
      prices: [
        { id: "p-13", packageId: "pkg-4", roomType: "SHARING", amount: 315000 },
        { id: "p-14", packageId: "pkg-4", roomType: "QUAD", amount: 330000 },
        { id: "p-15", packageId: "pkg-4", roomType: "TRIPLE", amount: 355000 },
        { id: "p-16", packageId: "pkg-4", roomType: "DOUBLE", amount: 395000 },
      ],
      childPricing: {
        id: "cp-4",
        packageId: "pkg-4",
        infantPrice: 95000,
        childNoBedPrice: 195000,
        childBedDiscount: 20000,
      },
    },
  ];
}
