// lib/cms/init.ts
import { ensureCmsSchema } from "./db";

let initialized = false;

export async function initCms() {
  if (initialized) return;
  initialized = true;
  await ensureCmsSchema();
}