import { fmtBDT } from "@/lib/goldCalc";
import { usePrices } from "@/lib/usePrices";

export function PriceGrid() {
    const { prices } = usePrices();
    const rows = [
        { k: "22K", grade: "22 Carat", g: prices.k22_gram, b: prices.k22_bhori, tag: "Hallmark" as const },
        { k: "21K", grade: "21 Carat", g: prices.k21_gram, b: prices.k21_bhori },
        { k: "18K", grade: "18 Carat", g: prices.k18_gram, b: prices.k18_bhori },
        { k: "Trad", grade: "Traditional", g: prices.trad_gram, b: prices.trad_bhori },
        { k: "Ag", grade: "Silver", g: prices.silver_gram, b: prices.silver_bhori },
    ];

    return (
        <section id="prices" className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex items-end justify-between mb-6">
                <div>
                    <h2 className="font-display text-3xl text-gold-bright">Today's Prices</h2>
                    <p className="text-sm text-muted-foreground mt-1">Per gram & per bhori — BAJUS official rates</p>
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((r) => (
                    <div key={r.k} className="gold-card p-5 hover:border-gold/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] uppercase tracking-widest text-gold-dim">{r.k}</p>
                                <p className="text-base font-medium mt-0.5">{r.grade}</p>
                            </div>
                            {"tag" in r && r.tag && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                                    {r.tag}
                                </span>
                            )}
                        </div>
                        <div className="mt-5">
                            <p className="price-number font-display text-3xl font-bold">{fmtBDT(r.b)}</p>
                            <p className="text-xs text-muted-foreground">per bhori</p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border/60 flex justify-between text-sm">
                            <span className="text-muted-foreground">per gram</span>
                            <span className="text-gold">{fmtBDT(r.g)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
