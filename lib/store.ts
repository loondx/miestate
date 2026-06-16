import { promises as fs } from "fs";
import path from "path";

/**
 * MVP file-backed store. Reads/writes JSON files in /lib/data.
 *
 * NOTE: On Vercel's serverless filesystem these writes are ephemeral and will
 * not persist across deploys/cold starts. This is intentional for the MVP —
 * Phase 2 swaps these functions for Supabase calls with the same signatures.
 */

const DATA_DIR = path.join(process.cwd(), "lib", "data");

async function readCollection<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeCollection<T>(file: string, data: T[]): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

export const FILES = {
  properties: "properties.json",
  leads: "leads.json",
  reports: "reports.json",
  transactions: "transactions.json",
} as const;

export function getAll<T>(file: string) {
  return readCollection<T>(file);
}

export async function getById<T extends { id: string }>(
  file: string,
  id: string
): Promise<T | undefined> {
  const all = await readCollection<T>(file);
  return all.find((item) => item.id === id);
}

export async function create<T extends { id: string }>(
  file: string,
  item: T
): Promise<T> {
  const all = await readCollection<T>(file);
  all.unshift(item);
  await writeCollection(file, all);
  return item;
}

export async function update<T extends { id: string }>(
  file: string,
  id: string,
  patch: Partial<T>
): Promise<T | undefined> {
  const all = await readCollection<T>(file);
  const idx = all.findIndex((item) => item.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], ...patch };
  await writeCollection(file, all);
  return all[idx];
}

export async function remove<T extends { id: string }>(
  file: string,
  id: string
): Promise<boolean> {
  const all = await readCollection<T>(file);
  const next = all.filter((item) => item.id !== id);
  if (next.length === all.length) return false;
  await writeCollection(file, next);
  return true;
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}
