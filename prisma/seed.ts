import { PrismaClient, Role, PackageStatus, City, RoomType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const flightLegsData = [
  {
    flightNo: "QR 601",
    route: "PEW-DOH",
    date: new Date("2026-10-03T04:05:00Z"),
    depTime: "04:05",
    arrTime: "06:05",
    sortOrder: 1,
  },
  {
    flightNo: "QR 1248",
    route: "DOH-JED",
    date: new Date("2026-10-03T12:40:00Z"),
    depTime: "12:40",
    arrTime: "15:10",
    sortOrder: 2,
  },
  {
    flightNo: "QR 1249",
    route: "JED-DOH",
    date: new Date("2026-10-22T16:40:00Z"),
    depTime: "16:40",
    arrTime: "19:00",
    sortOrder: 3,
  },
  {
    flightNo: "QR 600",
    route: "DOH-PEW",
    date: new Date("2026-10-22T21:10:00Z"),
    depTime: "21:10",
    arrTime: "02:35",
    sortOrder: 4,
  },
];

const childPricingData = {
  infantPrice: 95000,
  childNoBedPrice: 195000,
  childBedDiscount: 20000,
};

const packagesData = [
  {
    slug: "arafat-zabhi-20-days",
    title: "Arafat Zabhi & Hala Taiba - 20 Days",
    durationDays: 20,
    departureCity: "Peshawar",
    departureDate: new Date("2026-10-03T04:05:00Z"),
    returnDate: new Date("2026-10-22T21:10:00Z"),
    airline: "Qatar Airways",
    status: PackageStatus.OPEN,
    isFeatured: true,
    isPublished: true,
    sortOrder: 1,
    hotels: [
      {
        city: City.MAKKAH,
        hotelName: "Arafat Zabhi",
        locationNote: "Umm Al Mounin Street, Kudai Shuttle Service",
        nights: "6+7",
      },
      {
        city: City.MADINAH,
        hotelName: "Hala Taiba",
        locationNote: "Abdul Aziz Road, Shuttle Service",
        nights: "6",
      },
    ],
    prices: [
      { roomType: RoomType.SHARING, amount: 231988 },
      { roomType: RoomType.QUAD, amount: 240044 },
      { roomType: RoomType.TRIPLE, amount: 250532 },
      { roomType: RoomType.DOUBLE, amount: 271508 },
    ],
  },
  {
    slug: "that-hotel-20-days",
    title: "That Hotel & Diyar Al Safa - 20 Days",
    durationDays: 20,
    departureCity: "Peshawar",
    departureDate: new Date("2026-10-03T04:05:00Z"),
    returnDate: new Date("2026-10-22T21:10:00Z"),
    airline: "Qatar Airways",
    status: PackageStatus.OPEN,
    isFeatured: true,
    isPublished: true,
    sortOrder: 2,
    hotels: [
      {
        city: City.MAKKAH,
        hotelName: "That Hotel",
        locationNote: "Misfalah Kubri, 800 Mtrs",
        nights: "6+7",
      },
      {
        city: City.MADINAH,
        hotelName: "Diyar Al Safa Center",
        locationNote: "Masjid Bilal Side, 700-750 Mtrs",
        nights: "6",
      },
    ],
    prices: [
      { roomType: RoomType.SHARING, amount: 252052 },
      { roomType: RoomType.QUAD, amount: 260070 },
      { roomType: RoomType.TRIPLE, amount: 277233 },
      { roomType: RoomType.DOUBLE, amount: 311560 },
    ],
  },
  {
    slug: "rukan-al-zawai-20-days",
    title: "Rukan Al Zawai & Essa Karim - 20 Days",
    durationDays: 20,
    departureCity: "Peshawar",
    departureDate: new Date("2026-10-03T04:05:00Z"),
    returnDate: new Date("2026-10-22T21:10:00Z"),
    airline: "Qatar Airways",
    status: PackageStatus.OPEN,
    isFeatured: true,
    isPublished: true,
    sortOrder: 3,
    hotels: [
      {
        city: City.MAKKAH,
        hotelName: "Rukan Al Zawai",
        locationNote: "Ibrahim Khalil Road, 700-800 Mtrs",
        nights: "6+7",
      },
      {
        city: City.MADINAH,
        hotelName: "Essa Karim",
        locationNote: "Old Dream Madinah Albaik, Oppo Side 600 Mtrs",
        nights: "6",
      },
    ],
    prices: [
      { roomType: RoomType.SHARING, amount: 263756 },
      { roomType: RoomType.QUAD, amount: 270900 },
      { roomType: RoomType.TRIPLE, amount: 291673 },
      { roomType: RoomType.DOUBLE, amount: 333220 },
    ],
  },
];

async function main() {
  console.log("🌱 Starting idempotent database seed...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@noortravels.pk";
  const rawAdminPassword = process.env.ADMIN_PASSWORD || "NoorAdmin2026!";
  const passwordHash = await bcrypt.hash(rawAdminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.OWNER,
    },
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.OWNER,
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email} (Role: ${admin.role})`);

  // 2. Seed 3 Packages
  for (const pkgData of packagesData) {
    const pkg = await prisma.package.upsert({
      where: { slug: pkgData.slug },
      update: {
        title: pkgData.title,
        durationDays: pkgData.durationDays,
        departureCity: pkgData.departureCity,
        departureDate: pkgData.departureDate,
        returnDate: pkgData.returnDate,
        airline: pkgData.airline,
        status: pkgData.status,
        isFeatured: pkgData.isFeatured,
        isPublished: pkgData.isPublished,
        sortOrder: pkgData.sortOrder,
      },
      create: {
        slug: pkgData.slug,
        title: pkgData.title,
        durationDays: pkgData.durationDays,
        departureCity: pkgData.departureCity,
        departureDate: pkgData.departureDate,
        returnDate: pkgData.returnDate,
        airline: pkgData.airline,
        status: pkgData.status,
        isFeatured: pkgData.isFeatured,
        isPublished: pkgData.isPublished,
        sortOrder: pkgData.sortOrder,
      },
    });

    // Idempotently reset and insert flight legs
    await prisma.flightLeg.deleteMany({ where: { packageId: pkg.id } });
    await prisma.flightLeg.createMany({
      data: flightLegsData.map((leg) => ({
        ...leg,
        packageId: pkg.id,
      })),
    });

    // Idempotently reset and insert hotel stays
    await prisma.hotelStay.deleteMany({ where: { packageId: pkg.id } });
    await prisma.hotelStay.createMany({
      data: pkgData.hotels.map((hotel) => ({
        ...hotel,
        packageId: pkg.id,
      })),
    });

    // Idempotently upsert room prices
    for (const price of pkgData.prices) {
      await prisma.packagePrice.upsert({
        where: {
          packageId_roomType: {
            packageId: pkg.id,
            roomType: price.roomType,
          },
        },
        update: {
          amount: price.amount,
        },
        create: {
          packageId: pkg.id,
          roomType: price.roomType,
          amount: price.amount,
        },
      });
    }

    // Idempotently upsert child pricing
    await prisma.childPricing.upsert({
      where: { packageId: pkg.id },
      update: childPricingData,
      create: {
        packageId: pkg.id,
        ...childPricingData,
      },
    });

    console.log(`✅ Seeded package: ${pkg.title} (${pkg.slug})`);
  }

  console.log("🎉 Seed finished successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
