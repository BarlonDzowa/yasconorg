import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "./security";
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  var __prisma: PrismaClient | undefined;
}

function buildConnectionUrl(): string {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  let url = connectionString;
  if (!url.includes("connection_limit")) {
    url += url.includes("?") ? "&" : "?";
    url += "connection_limit=1";
  }
  if (!url.includes("connect_timeout")) url += "&connect_timeout=15";
  if (!url.includes("pool_timeout")) url += "&pool_timeout=15";
  return url;
}

function createPrismaClient(): PrismaClient {
  const url = buildConnectionUrl();
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

let _prodClient: PrismaClient | undefined;

export function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    if (!_prodClient) _prodClient = createPrismaClient();
    return _prodClient;
  }
  if (!global.__prisma) global.__prisma = createPrismaClient();
  return global.__prisma;
}

export async function withRetry<T>(
  fn: (client: PrismaClient) => Promise<T>,
  retries = 3,
  delayMs = 300
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn(getPrismaClient());
    } catch (err: any) {
      lastError = err;
      const isNetwork =
        err?.code === "ECONNRESET" ||
        err?.code === "ECONNREFUSED" ||
        err?.code === "ETIMEDOUT" ||
        err?.message?.includes("TLS") ||
        err?.message?.includes("socket");
      if (!isNetwork || attempt === retries) throw err;
      console.warn(`[db] Attempt ${attempt} failed, retrying...`);
      _prodClient = undefined;
      global.__prisma = undefined;
      await new Promise((r) => setTimeout(r, delayMs * attempt));
    }
  }
  throw lastError;
}

export async function ensureCmsSchema() {
  const client = getPrismaClient();
  await ensureBootstrapAdmin(client);
}

async function ensureBootstrapAdmin(client: PrismaClient) {
  const email = process.env.CMS_SUPERADMIN_EMAIL;
  const password = process.env.CMS_SUPERADMIN_PASSWORD;
  const name = process.env.CMS_SUPERADMIN_NAME ?? "CMS Super Admin";
  if (!email || !password) return;
  const existing = await client.cmsUser.findUnique({ where: { email } });
  if (existing) return;
  await client.cmsUser.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      role: "super_admin",
      region: "national",
    },
  });
}
