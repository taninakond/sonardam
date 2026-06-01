import { promises as fs } from "node:fs";
import path from "node:path";
import type { LivePrices } from "./bajus.scraper.server";

const FILE = path.join(process.cwd(), "src", "data", "goldData.ts");

function formatDateInDhaka(d: Date): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(d);
    const y = parts.find((p) => p.type === "year")?.value ?? "0000";
    const m = parts.find((p) => p.type === "month")?.value ?? "01";
    const day = parts.find((p) => p.type === "day")?.value ?? "01";
    return `${y}-${m}-${day}`;
}

function diff(curr: number, prev: number | undefined): number {
    return prev != null ? curr - prev : 0;
}

function rewriteTodayBlock(
    content: string,
    p: LivePrices,
    prev: LivePrices | null,
    date: string,
): string {
    const change = `change: { k22: ${diff(p.k22_gram, prev?.k22_gram)}, k21: ${diff(
        p.k21_gram,
        prev?.k21_gram,
    )}, k18: ${diff(p.k18_gram, prev?.k18_gram)}, trad: ${diff(
        p.trad_gram,
        prev?.trad_gram,
    )} }`;

    return content
        .replace(/date: "\d{4}-\d{2}-\d{2}"/, `date: "${date}"`)
        .replace(
            /k22_gram: \d+, k22_bhori: \d+/,
            `k22_gram: ${p.k22_gram}, k22_bhori: ${p.k22_bhori}`,
        )
        .replace(
            /k21_gram: \d+, k21_bhori: \d+/,
            `k21_gram: ${p.k21_gram}, k21_bhori: ${p.k21_bhori}`,
        )
        .replace(
            /k18_gram: \d+, k18_bhori: \d+/,
            `k18_gram: ${p.k18_gram}, k18_bhori: ${p.k18_bhori}`,
        )
        .replace(
            /trad_gram: \d+, trad_bhori: \d+/,
            `trad_gram: ${p.trad_gram}, trad_bhori: ${p.trad_bhori}`,
        )
        .replace(
            /silver_bhori: \d+, silver_gram: \d+/,
            `silver_bhori: ${p.silver_bhori}, silver_gram: ${p.silver_gram}`,
        )
        .replace(
            /change: \{ k22: -?\d+, k21: -?\d+, k18: -?\d+, trad: -?\d+ \}/,
            change,
        );
}

function upsertLastEntry(
    body: string,
    newEntry: string,
    date: string,
): { body: string; changed: boolean } {
    const entryRe = /\{\s*date:\s*'(\d{4}-\d{2}-\d{2})'[^}]*\}/g;
    const matches = [...body.matchAll(entryRe)];
    if (matches.length === 0) {
        return { body: body.trimEnd() + "\n    " + newEntry + "\n", changed: true };
    }
    const last = matches[matches.length - 1];
    const lastDate = last[1];
    if (lastDate === date) {
        // Check if values are the same. Extract values from the entry to compare.
        // We only need basic check: does the entry string match precisely?
        // For better precision, we'd parse the values, but since we're replacing, 
        // if the content is exactly the same, a replace won't change anything.

        const newEntryWithFormatting = "    " + newEntry;
        // This is the part where we check if we actually need to update.
        // To prevent "empty tabs" (repeated writes of same data), we only replace if data differs.
        // However, the regex match 'last' might not include the leading spaces.

        const a = body.slice(last.index!);
        if (a.trim().startsWith(newEntry.trim())) {
            return { body, changed: false };
        }

        const newBody =
            body.slice(0, last.index!) +
            "    " +
            newEntry +
            body.slice(last.index! + last[0].length);
        return { body: newBody, changed: true };
    }

    // Append new entry: ensure we don't leave trailing whitespace before the comma
    return {
        body: body.trimEnd() + ",\n    " + newEntry,
        changed: true,
    };
}

function rewriteArraySection(
    content: string,
    exportName: string,
    newEntry: string,
    date: string,
): { content: string; changed: boolean } {
    const re = new RegExp(`(export const ${exportName} = \\[[\\s\\S]*?)(\\];)`, "m");
    const m = content.match(re);
    if (!m) return { content, changed: false };
    const [full, body, end] = m;
    const result = upsertLastEntry(body, newEntry, date);
    if (!result.changed) return { content, changed: false };
    return { content: content.replace(full, result.body + end), changed: true };
}

function rewriteRecentData(content: string, p: LivePrices, date: string) {
    return rewriteArraySection(
        content,
        "RECENT_DATA",
        `{ date: '${date}', k22: ${p.k22_gram}, k21: ${p.k21_gram}, k18: ${p.k18_gram}, trad: ${p.trad_gram} }`,
        date,
    );
}

function rewriteAllTimeData(content: string, p: LivePrices, date: string) {
    return rewriteArraySection(
        content,
        "ALL_TIME_DATA",
        `{ date: '${date}', k22: ${p.k22_gram}, k21: ${p.k21_gram}, k18: ${p.k18_gram} }`,
        date,
    );
}

function rewriteMilestones(content: string, p: LivePrices, date: string): string {
    return content.replace(
        /\{\s*date:\s*"\d{4}-\d{2}-\d{2}",\s*k22:\s*\d+,\s*label:\s*"Current"\s*\}/,
        `{ date: "${date}", k22: ${p.k22_gram}, label: "Current" }`,
    );
}

export async function rewriteGoldDataTs(
    p: LivePrices,
    prev: LivePrices | null = null,
): Promise<{ changed: boolean; reason?: string }> {
    let content: string;
    try {
        content = await fs.readFile(FILE, "utf-8");
    } catch (err) {
        return { changed: false, reason: `read-failed: ${(err as Error).message}` };
    }

    const date = formatDateInDhaka(new Date(p.fetchedAt));
    const before = content;

    content = rewriteTodayBlock(content, p, prev, date);
    {
        const r = rewriteRecentData(content, p, date);
        content = r.content;
    }
    {
        const r = rewriteAllTimeData(content, p, date);
        content = r.content;
    }
    content = rewriteMilestones(content, p, date);

    if (content === before) return { changed: false, reason: "no-changes" };

    try {
        await fs.writeFile(FILE, content, "utf-8");
        return { changed: true, reason: `wrote date ${date}` };
    } catch (err) {
        return { changed: false, reason: `write-failed: ${(err as Error).message}` };
    }
}
