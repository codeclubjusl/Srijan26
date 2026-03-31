import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as { prisma?: PrismaClient };

let dbUrl = process.env.DATABASE_URL;
if (dbUrl && !dbUrl.includes("maxPoolSize")) {
  dbUrl += dbUrl.includes("?") ? "&maxPoolSize=1" : "?maxPoolSize=1";
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
