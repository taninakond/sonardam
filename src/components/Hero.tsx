import { fmtBDT } from "@/lib/goldCalc";
import { usePrices } from "@/lib/usePrices";
import { ALL_TIME_DATA, RECENT_DATA } from "@/data/goldData";
import { ShieldCheck, TrendingUp } from "lucide-react";

const HISTORICAL_COUNT = new Set(
    [...ALL_TIME_DATA, ...RECENT_DATA].map((r) => r.date),
).size;

export function Hero() {
    const { prices } = usePrices();
    return (
        <section id="top" className="relative overflow-hidden">
            <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[700px]"
                style={{
                    background:
                        "radial-gradient(ellipse at center, color-mix(in oklab, var(--color-gold) 14%, transparent) 0%, transparent 65%)",
                }}
            />
            <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 text-center animate-fade-up">
                <p className="font-bn text-sm text-muted-foreground">আজকের বাজার দর</p>
                <p className="text-xs uppercase tracking-[0.2em] text-gold-dim mt-1">
                    Today's BAJUS rate
                </p>

                <div className="gold-card mx-auto mt-8 max-w-2xl px-8 py-10 sm:py-12">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        22 Carat Gold — Today's Rate
                    </p>
                    <p className="price-number text-5xl sm:text-7xl mt-3 font-display font-bold">
                        {fmtBDT(prices.k22_bhori)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">per bhori</p>
                    <p className="text-base sm:text-lg mt-4 text-foreground/80">
                        {fmtBDT(prices.k22_gram)} <span className="text-muted-foreground">per gram</span>
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground border border-border">
                        {prices.source === "bajus"
                            ? "Live from bajus.org"
                            : "Showing cached rate · tap refresh to sync"}
                    </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/5 border border-gold/20 text-gold">
                        <ShieldCheck className="size-3.5" /> BAJUS Certified
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/5 border border-gold/20 text-muted-foreground">
                        <TrendingUp className="size-3.5 text-gold" /> {HISTORICAL_COUNT} historical records
                    </span>
                </div>
            </div>
        </section>
    );
}
