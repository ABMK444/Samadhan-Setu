import { createSeed } from "../data/seed";
import type { Database } from "../types";
const KEY = "samadhan-setu-v1";
export const uid = (prefix: string) =>
  `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
export const today = () => new Date().toISOString().slice(0, 10);
// TODO BACKEND: Replace this device-local repository with API requests. A single
// document write makes each demo workflow atomic (e.g. uptake + notification).
export function readDB(): Database {
  const value = localStorage.getItem(KEY);
  if (!value) {
    const seed = createSeed();
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    const db = JSON.parse(value) as Database;
    if (!Array.isArray(db.challenges) || !Array.isArray(db.projects))
      throw Error();
    return db;
  } catch {
    throw new Error(
      "Saved demo data could not be read. Use Reset Demo Data on the login page.",
    );
  }
}
export function mutate<T>(fn: (db: Database) => T): T {
  const db = readDB();
  const result = fn(db);
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    throw new Error(
      "Unable to save. Browser storage may be full or disabled. Remove large attachments and retry.",
    );
  }
  window.dispatchEvent(new Event("samadhan-change"));
  return result;
}
export function resetDemo() {
  localStorage.setItem(KEY, JSON.stringify(createSeed()));
  window.dispatchEvent(new Event("samadhan-change"));
}
