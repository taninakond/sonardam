import { promises as fs } from "node:fs";
import path from "node:path";
import { FALLBACK_DATA, scrapeBajusPrices, type LivePrices } from "./bajus.scraper.server";
import { rewriteGoldDataTs } from "./goldDataWriter.server";

const CACHE_FILE = path.join(process.cwd(), ".data", "bajus-cache.json");

// Default 6h = 4 refreshes per day. Override with BAJUS_REFRESH_HOURS env var
// (e.g. set to 12 for 2 refreshes per day).
const REFRESH_HOURS = Number(process.env.BAJUS_REFRESH_HOURS ?? 6);
const REFRESH_INTERVAL_MS = REFRESH_HOURS * 60 * 60 * 1000;

let memoryCache: LivePrices | null = null;
let inFlight: Promise<LivePrices> | null = null;

function fallback(): LivePrices {
  return {
    ...FALLBACK_DATA,
    fetchedAt: new Date().toISOString(),
    source: "fallback",
  };
}

async function loadFromDisk(): Promise<LivePrices | null> {
  try {
    const text = await fs.readFile(CACHE_FILE, "utf-8");
    const parsed = JSON.parse(text) as LivePrices;
    if (typeof parsed?.k22_gram === "number") return parsed;
    return null;
  } catch {
    return null;
  }
}

async function writeToDisk(p: LivePrices): Promise<void> {
  await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(p, null, 2));
}

export async function getCached(): Promise<LivePrices> {
  if (memoryCache) return memoryCache;
  const fromDisk = await loadFromDisk();
  if (fromDisk) {
    memoryCache = fromDisk;
    return fromDisk;
  }
  return fallback();
}

export async function refreshAndPersist(): Promise<LivePrices> {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    const prev = memoryCache;
    let next: LivePrices;
    try {
      next = await scrapeBajusPrices();
    } catch (err) {
      console.error("[bajus] scrape failed:", err);
      const fb = fallback();
      fb.note = err instanceof Error ? err.message : "Unknown sync error";
      return memoryCache ?? fb;
    }
    memoryCache = next;
    try {
      await writeToDisk(next);
    } catch (err) {
      console.error("[bajus] cache disk write failed:", err);
    }
    try {
      const result = await rewriteGoldDataTs(next, prev);
      if (result.changed) console.log(`[bajus] goldData.ts updated (${result.reason})`);
      else if (result.reason) console.log(`[bajus] goldData.ts unchanged (${result.reason})`);
    } catch (err) {
      console.error("[bajus] goldData.ts rewrite failed:", err);
    }
    return next;
  })();
  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

declare global {
  var __bajusSchedulerStarted: boolean | undefined;
}

export function startScheduler(): void {
  if (globalThis.__bajusSchedulerStarted) return;
  globalThis.__bajusSchedulerStarted = true;

  const fire = (label: string) => {
    refreshAndPersist().catch((err) => console.error(`[bajus] ${label} fetch failed:`, err));
  };

  setTimeout(() => fire("initial"), 2_000);
  setInterval(() => fire("scheduled"), REFRESH_INTERVAL_MS);

  console.log(
    `[bajus] scheduler started — refresh every ${REFRESH_HOURS}h (${(24 / REFRESH_HOURS).toFixed(1)}×/day)`,
  );
}
