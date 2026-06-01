import { fmtBDT } from "@/lib/goldCalc";
import { usePrices } from "@/lib/usePrices";

export function Ticker() {
    const { prices } = usePrices();
    const items = [
        `22K  ${fmtBDT(prices.k22_gram)}/g  •  ${fmtBDT(prices.k22_bhori)}/bhori`,
        `21K  ${fmtBDT(prices.k21_gram)}/g  •  ${fmtBDT(prices.k21_bhori)}/bhori`,
        `18K  ${fmtBDT(prices.k18_gram)}/g  •  ${fmtBDT(prices.k18_bhori)}/bhori`,
        `Traditional  ${fmtBDT(prices.trad_gram)}/g`,
        `Silver  ${fmtBDT(prices.silver_bhori)}/bhori`,
        `All-time High  ৳24,520/g  (29 Jan 2026)`,
        `Source  ${prices.source === "bajus" ? "BAJUS live" : "Cached fallback"}`,
    ];
    const line = items.join("    —    ");
    return (
        <div className="sticky top-0 z-50 h-9 overflow-hidden border-b border-gold/15 bg-[oklch(0.1_0.018_260)] flex items-center text-[12px]">
            <div className="flex items-center gap-2 pl-4 pr-3 shrink-0 border-r border-gold/15 h-full">
                <span className="size-1.5 rounded-full bg-up animate-pulse-dot" />
                <span className="text-up font-semibold tracking-wider">LIVE</span>
            </div>
            <div className="relative flex-1 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap flex">
                    <span className="px-6 text-gold-bright">{line}</span>
                    <span className="px-6 text-gold-bright">{line}</span>
                </div>
            </div>
            <div className="hidden sm:block shrink-0 pl-3 pr-4 text-muted-foreground border-l border-gold/15 h-full leading-9">
                BAJUS • Sync via header
            </div>
        </div>
    );
}
