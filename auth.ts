import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/db";
import { authConfig } from "./auth.config";
import { Role } from "@prisma/client";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function isRealDatabaseConfigured(): boolean {
  const dbUrl = process.env.DATABASE_URL;
  return Boolean(dbUrl && !dbUrl.includes("ep-sample") && !dbUrl.includes("placeholder"));
}

// Development fallback store for local testing when live Neon DB is not connected
interface DevAdminRecord {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  failedLogins: number;
  lockedUntil: Date | null;
}

const defaultAdminPassword = process.env.ADMIN_PASSWORD || "NoorAdmin2026!";
const devAdminUsers: DevAdminRecord[] = [
  {
    id: "admin-owner-default",
    email: (process.env.ADMIN_EMAIL || "admin@noortravels.pk").toLowerCase().trim(),
    passwordHash: bcrypt.hashSync(defaultAdminPassword, 10),
    role: Role.OWNER,
    failedLogins: 0,
    lockedUntil: null,
  },
  {
    id: "admin-staff-default",
    email: "staff@noortravels.pk",
    passwordHash: bcrypt.hashSync("NoorStaff2026!", 10),
    role: Role.STAFF,
    failedLogins: 0,
    lockedUntil: null,
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase().trim();
        const rawPassword = parsed.data.password;
        const now = new Date();

        if (isRealDatabaseConfigured()) {
          try {
            const user = await prisma.adminUser.findUnique({
              where: { email },
            });

            if (!user) {
              // User not found - return null for generic error (prevent enumeration)
              return null;
            }

            // Check if user is currently locked out
            if (user.lockedUntil && new Date(user.lockedUntil) > now) {
              return null;
            }

            // Verify password hash - NEVER log password!
            const isValid = await bcrypt.compare(rawPassword, user.passwordHash);

            if (!isValid) {
              const newFailed = user.failedLogins + 1;
              const isLocked = newFailed >= 5;
              const lockTime = isLocked ? new Date(Date.now() + 15 * 60 * 1000) : null;

              await prisma.adminUser.update({
                where: { id: user.id },
                data: {
                  failedLogins: newFailed,
                  ...(isLocked ? { lockedUntil: lockTime } : {}),
                },
              });

              return null;
            }

            // Reset counter on success
            if (user.failedLogins > 0 || user.lockedUntil) {
              await prisma.adminUser.update({
                where: { id: user.id },
                data: {
                  failedLogins: 0,
                  lockedUntil: null,
                },
              });
            }

            return {
              id: user.id,
              email: user.email,
              role: user.role,
            };
          } catch (dbErr) {
            console.error("Database error during admin authentication:", dbErr);
            // Fall through to dev store if DB connection fails
          }
        }

        // Dev store fallback logic (exact identical lockout behavior)
        const devUser = devAdminUsers.find((u) => u.email === email);
        if (!devUser) {
          return null;
        }

        if (devUser.lockedUntil && devUser.lockedUntil > now) {
          return null;
        }

        const isValid = await bcrypt.compare(rawPassword, devUser.passwordHash);
        if (!isValid) {
          devUser.failedLogins += 1;
          if (devUser.failedLogins >= 5) {
            devUser.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
          }
          return null;
        }

        // Success: reset failed logins & lockedUntil
        devUser.failedLogins = 0;
        devUser.lockedUntil = null;

        return {
          id: devUser.id,
          email: devUser.email,
          role: devUser.role,
        };
      },
    }),
  ],
});
