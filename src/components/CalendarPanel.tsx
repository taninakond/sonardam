import { useMemo, useState } from "react";
import { ALL_TIME_DATA } from "@/data/goldData";
import { fmtBDT, UNIT_TO_GRAM } from "@/lib/goldCalc";
import { CalendarDays } from "lucide-react";

type Row = (typeof ALL_TIME_DATA)[number];

function nearest(date: string): { before?: Row; after?: Row; exact?: Row } {
    let before: Row | undefined;
    let after: Row | undefined;
    for (const r of ALL_TIME_DATA) {
        if (r.date === date) return { exact: r };
        if (r.date < date) {
            if (!before || r.date > before.date) before = r;
        } else if (r.date > date) {
            if (!after || r.date < after.date) after = r;
        }
    }
    return { before, after };
}

const MIN = ALL_TIME_DATA[0].date;
const MAX = ALL_TIME_DATA[ALL_TIME_DATA.length - 1].date;

export function CalendarPanel() {
    const [date, setDate] = useState<string>(MAX);
    const [view, setView] = useState<"bhori" | "gram">("bhori");

    const result = useMemo(() => nearest(date), [date]);
    const mult = view === "bhori" ? UNIT_TO_GRAM.bhori : 1;

    const renderRow = (row: Row, tag: string) => (
        <div className="rounded-xl border border-gold/15 bg-background/30 p-5">
            <div className="flex items-baseline justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-gold-dim">{tag}</p>
                <p className="text-sm text-muted-foreground">{row.date}</p>
            </div>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
                {([["22k", row.k22], ["21k", row.k21], ["18k", row.k18]] as const).map(([k, v]) => (
                    <div key={k} className="contents">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="text-gold-bright text-right font-display">{fmtBDT(v * mult)}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );

    return (
        <div className="gold-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
                <span className="grid place-items-center size-10 rounded-xl bg-gold/10 border border-gold/30">
                    <CalendarDays className="size-5 text-gold" />
                </span>
                <div>
                    <h2 className="font-display text-2xl text-gold-bright">Price by Date</h2>
                    <p className="text-xs text-muted-foreground font-bn">
                        তারিখ অনুযায়ী BAJUS স্বর্ণের দাম দেখুন
                    </p>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-widest text-gold-dim">Date</label>
                    <input
                        type="date"
                        min={MIN}
                        max={MAX}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-2 w-full bg-background/40 border border-gold/25 rounded-xl px-4 py-3 text-base outline-none focus:border-gold/60"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-widest text-gold-dim">View as</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        {(["bhori", "gram"] as const).map((v) => {
                            const active = v === view;
                            return (
                                <button
                                    key={v}
                                    onClick={() => setView(v)}
                                    className={
                                        "py-3 rounded-xl text-sm font-medium border transition-colors capitalize " +
                                        (active
                                            ? "bg-gold text-primary-foreground border-gold"
                                            : "bg-background/30 border-gold/20 text-muted-foreground hover:text-gold hover:border-gold/40")
                                    }
                                >
                                    {v}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <p className="mt-3 text-[11px] text-muted-foreground font-bn">
                নির্বাচিত দিনটির দাম না থাকলে কাছের আগের ও পরের জানা দাম দেখানো হবে।
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                {result.exact && renderRow(result.exact, "Exact match")}
                {result.before && !result.exact && renderRow(result.before, "Nearest before")}
                {result.after && !result.exact && renderRow(result.after, "Nearest after")}
            </div>

            <p className="mt-5 text-[11px] text-muted-foreground">
                Showing per {view}. Data spans {MIN} → {MAX} ({ALL_TIME_DATA.length} BAJUS records).
            </p>
        </div>
    );
}
