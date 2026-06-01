import { useState, useMemo } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { ALL_TIME_DATA, RECENT_DATA, MILESTONES } from "@/data/goldData";
import { fmtBDT } from "@/lib/goldCalc";

type Period = "1M" | "3M" | "6M" | "1Y" | "ALL";
const periods: Period[] = ["1M", "3M", "6M", "1Y", "ALL"];

export function HistoryChart() {
    const [period, setPeriod] = useState<Period>("ALL");

    const data = useMemo(() => {
        // Merge & dedupe by date so longer windows draw the real long-range curve.
        const byDate = new Map<string, (typeof ALL_TIME_DATA)[number]>();
        for (const r of ALL_TIME_DATA) byDate.set(r.date, r);
        for (const r of RECENT_DATA) byDate.set(r.date, r);
        const merged = Array.from(byDate.values()).sort((a, b) =>
            a.date.localeCompare(b.date),
        );
        if (period === "ALL") return merged;
        const days = { "1M": 30, "3M": 90, "6M": 180, "1Y": 365 }[period];
        const cutoff = new Date("2026-06-01");
        cutoff.setDate(cutoff.getDate() - days);
        const cut = cutoff.toISOString().slice(0, 10);
        return merged.filter((r) => r.date >= cut);
    }, [period]);

    return (
        <section id="history" className="mx-auto max-w-6xl px-4 py-14">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                    <h2 className="font-display text-3xl text-gold-bright">Price History</h2>
                    <p className="text-sm text-muted-foreground">22K per gram, in BDT</p>
                </div>
                <div className="flex gap-1 p-1 rounded-xl bg-card border border-gold/20">
                    {periods.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={
                                "px-3 py-1.5 text-xs rounded-lg transition-colors " +
                                (p === period
                                    ? "bg-gold text-primary-foreground"
                                    : "text-muted-foreground hover:text-gold")
                            }
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="gold-card p-4 sm:p-6">
                <div className="h-72 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="oklch(0.86 0.16 90)" stopOpacity={0.55} />
                                    <stop offset="100%" stopColor="oklch(0.86 0.16 90)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.78 0.13 85 / 0.12)" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(d) => d.slice(0, 7)}
                                stroke="oklch(0.7 0.02 255)"
                                fontSize={11}
                                minTickGap={32}
                            />
                            <YAxis
                                stroke="oklch(0.7 0.02 255)"
                                fontSize={11}
                                tickFormatter={(v) => "৳" + (v / 1000).toFixed(0) + "k"}
                                width={50}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "oklch(0.21 0.025 260)",
                                    border: "1px solid oklch(0.78 0.13 85 / 0.4)",
                                    borderRadius: 12,
                                    fontSize: 12,
                                }}
                                labelStyle={{ color: "oklch(0.86 0.16 90)" }}
                                formatter={(v: number) => [fmtBDT(v), "22K /g"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="k22"
                                stroke="oklch(0.86 0.16 90)"
                                strokeWidth={2}
                                fill="url(#goldFill)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {MILESTONES.map((m) => (
                        <div
                            key={m.date}
                            className="px-3 py-1.5 rounded-full bg-background/40 border border-gold/20 text-xs"
                        >
                            <span className="text-muted-foreground">{m.date}</span>
                            <span className="text-gold mx-2">{fmtBDT(m.k22)}</span>
                            <span className="text-foreground/80">{m.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
