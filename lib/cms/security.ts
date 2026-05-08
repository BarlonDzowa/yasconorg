import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashed: string): boolean {
  const [salt, expectedHash] = hashed.split(":");
  if (!salt || !expectedHash) {
    return false;
  }

  const suppliedHash = scryptSync(password, salt, 64).toString("hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const suppliedBuffer = Buffer.from(suppliedHash, "hex");

  if (expectedBuffer.length !== suppliedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export function generateSessionToken() {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

