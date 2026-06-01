import { createServerFn } from "@tanstack/react-start";
import { getCached, refreshAndPersist } from "./bajus.cache.server";
import type { LivePrices } from "./bajus.scraper.server";

export type { LivePrices };

// Cheap read: returns whatever the scheduler/sync last wrote to the cache.
// Never scrapes BAJUS itself.
export const fetchBajusPrices = createServerFn({ method: "GET" }).handler(
  async (): Promise<LivePrices> => {
    return getCached();
  },
);

// Force a fresh scrape → update memory cache → persist to .data/bajus-cache.json
// → rewrite src/data/goldData.ts. Used by the header sync button.
export const syncBajusPrices = createServerFn({ method: "POST" }).handler(
  async (): Promise<LivePrices> => {
    return refreshAndPersist();
  },
);
