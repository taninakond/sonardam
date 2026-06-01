import { createServerFn } from "@tanstack/react-start";
import { TODAY } from "@/data/goldData";

const BHORI_G = 11.664;

export type LivePrices = {
    k22_gram: number;
    k21_gram: number;
    k18_gram: number;
    trad_gram: number;
    k22_bhori: number;
    k21_bhori: number;
    k18_bhori: number;
    trad_bhori: number;
    silver_gram: number;
    silver_bhori: number;
    fetchedAt: string; // ISO timestamp
    source: "bajus" | "fallback";
    note?: string;
};

const FALLBACK: Omit<LivePrices, "fetchedAt" | "source" | "note"> = {
    k22_gram: TODAY.k22_gram,
    k21_gram: TODAY.k21_gram,
    k18_gram: TODAY.k18_gram,
    trad_gram: TODAY.trad_gram,
    k22_bhori: TODAY.k22_bhori,
    k21_bhori: TODAY.k21_bhori,
    k18_bhori: TODAY.k18_bhori,
    trad_bhori: TODAY.trad_bhori,
    silver_gram: TODAY.silver_gram,
    silver_bhori: TODAY.silver_bhori,
};

// Server fn: scrape BAJUS gold-price page and parse per-gram rates.
export const fetchBajusPrices = createServerFn({ method: "GET" }).handler(
    async (): Promise<LivePrices> => {
        try {
            const res = await fetch("https://www.bajus.org/gold-price", {
                headers: {
                    "user-agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    accept:
                        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "accept-language": "en-US,en;q=0.9,bn;q=0.8",
                    "accept-encoding": "gzip, deflate, br",
                    "cache-control": "no-cache",
                    pragma: "no-cache",
                    referer: "https://www.bajus.org/",
                },
            });
            if (!res.ok) throw new Error(`BAJUS HTTP ${res.status}`);
            const html = await res.text();

            const pick = (label: RegExp) => {
                const m = html.match(label);
                if (!m) return null;
                const n = Number(m[1].replace(/[,\s]/g, ""));
                return Number.isFinite(n) && n > 0 ? n : null;
            };

            // Matches table cells like: "22 KARAT Gold ... 20,415 BDT/GRAM"
            const k22 = pick(/22[^<]*KARAT[\s\S]{0,400}?Gold[\s\S]{0,400}?([\d,]+)\s*BDT\s*\/\s*GRAM/i);
            const k21 = pick(/21[^<]*KARAT[\s\S]{0,400}?Gold[\s\S]{0,400}?([\d,]+)\s*BDT\s*\/\s*GRAM/i);
            const k18 = pick(/18[^<]*KARAT[\s\S]{0,400}?Gold[\s\S]{0,400}?([\d,]+)\s*BDT\s*\/\s*GRAM/i);
            const trad = pick(/TRADITIONAL[\s\S]{0,400}?Gold[\s\S]{0,400}?([\d,]+)\s*BDT\s*\/\s*GRAM/i);
            const ag = pick(/22[^<]*KARAT[\s\S]{0,400}?Silver[\s\S]{0,400}?([\d,]+)\s*BDT\s*\/\s*GRAM/i);

            if (!k22 || !k21 || !k18 || !trad) {
                throw new Error("BAJUS parse failed");
            }

            const silverG = ag ?? FALLBACK.silver_gram;

            console.log(k22, k21, k18, trad, ag)

            return {
                k22_gram: k22,
                k21_gram: k21,
                k18_gram: k18,
                trad_gram: trad,
                k22_bhori: Math.round(k22 * BHORI_G),
                k21_bhori: Math.round(k21 * BHORI_G),
                k18_bhori: Math.round(k18 * BHORI_G),
                trad_bhori: Math.round(trad * BHORI_G),
                silver_gram: silverG,
                silver_bhori: Math.round(silverG * BHORI_G),
                fetchedAt: new Date().toISOString(),
                source: "bajus",
            };
        } catch (err) {
            console.error("BAJUS sync failed:", err);
            return {
                ...FALLBACK,
                fetchedAt: new Date().toISOString(),
                source: "fallback",
                note: err instanceof Error ? err.message : "Unknown sync error",
            };
        }
    },
);
