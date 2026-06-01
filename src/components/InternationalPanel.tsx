import { useMemo, useState } from "react";
import { INTL_MARKETS } from "@/data/internationalData";
import { UNIT_TO_GRAM, fmtBDT, fmtNum } from "@/lib/goldCalc";
import { usePrices } from "@/lib/usePrices";
import { Globe2, ArrowDown, ArrowUp } from "lucide-react";

type Karat = "24k" | "22k" | "21k" | "18k";
type View = "bhori" | "gram";
type Curr = "bdt" | "local";

const karatRatio: Record<Karat, number> = {
    "24k": 24 / 22,
    "22k": 1,
    "21k": 21 / 22,
    "18k": 18 / 22,
};

export function InternationalPanel() {
    const { prices } = usePrices();
    const baseline22kBhori = prices.k22_bhori;

    const [karat, setKarat] = useState<Karat>("22k");
    const [view, setView] = useState<View>("bhori");
    const [curr, setCurr] = useState<Curr>("bdt");

    const rows = useMemo(() => {
        const ratio = karatRatio[karat];
        const mult = view === "bhori" ? 1 : 1 / UNIT_TO_GRAM.bhori;
        const baselineBdt = baseline22kBhori * ratio * mult;
        const data = INTL_MARKETS.map((m) => {
            const bdt = m.pricePerBhori * ratio * mult;
            const diff = bdt - baselineBdt;
            const local = bdt / m.fxToBdt;
            return { ...m, bdt, local, diff };
        }).sort((a, b) => a.bdt - b.bdt);
        return { data, baselineBdt };
    }, [karat, view, baseline22kBhori]);

    const cheapest = rows.data[0];
    const highest = rows.data[rows.data.length - 1];

    return (
        <div className="gold-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
                <span className="grid place-items-center size-10 rounded-xl bg-gold/10 border border-gold/30">
                    <Globe2 className="size-5 text-gold" />
                </span>
                <div>
                    <h2 className="font-display text-2xl text-gold-bright">International vs Bangladesh</h2>
                    <p className="text-xs text-muted-foreground font-bn">
                        মধ্যপ্রাচ্য, মালয়েশিয়া, ইউরোপ ও যুক্তরাষ্ট্রে ২২ ক্যারেট স্বর্ণের তুলনা
                    </p>
                </div>
            </div>

            {/* Highlights */}
            <div className="grid gap-3 md:grid-cols-3 mb-6">
                <div className="rounded-xl border border-up/30 bg-up/5 p-4">
                    <p className="text-[11px] uppercase tracking-widest text-up flex items-center gap-1.5"><ArrowDown className="size-3" /> Cheapest</p>
                    <p className="mt-1 font-display text-lg text-gold-bright">{cheapest.country}</p>
                    <p className="text-sm text-muted-foreground">{fmtBDT(cheapest.bdt)}</p>
                </div>
                <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
                    <p className="text-[11px] uppercase tracking-widest text-gold-dim">BAJUS Baseline</p>
                    <p className="mt-1 font-display text-lg text-gold-bright">Bangladesh</p>
                    <p className="text-sm text-muted-foreground">{fmtBDT(rows.baselineBdt)}</p>
                </div>
                <div className="rounded-xl border border-down/30 bg-down/5 p-4">
                    <p className="text-[11px] uppercase tracking-widest text-down flex items-center gap-1.5"><ArrowUp className="size-3" /> Highest</p>
                    <p className="mt-1 font-display text-lg text-gold-bright">{highest.country}</p>
                    <p className="text-sm text-muted-foreground">{fmtBDT(highest.bdt)}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="grid gap-3 sm:grid-cols-3 mb-4">
                <Toggle<Karat> label="Karat" value={karat} setValue={setKarat} opts={["24k", "22k", "21k", "18k"]} />
                <Toggle<View> label="Unit" value={view} setValue={setView} opts={["bhori", "gram"]} />
                <Toggle<Curr> label="Currency" value={curr} setValue={setCurr} opts={["bdt", "local"]} />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gold/15">
                <table className="w-full text-sm min-w-[640px]">
                    <thead className="bg-background/40 text-[11px] uppercase tracking-widest text-gold-dim">
                        <tr>
                            <th className="text-left px-4 py-3">Market</th>
                            <th className="text-right px-4 py-3">{karat} / {view}</th>
                            <th className="text-right px-4 py-3">vs BAJUS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                        {rows.data.map((m) => {
                            const cheaper = m.diff < 0;
                            const isBd = m.country === "Bangladesh";
                            return (
                                <tr key={m.country} className="hover:bg-background/30">
                                    <td className="px-4 py-3">
                                        <a href={m.url} target="_blank" rel="noreferrer" className="font-medium text-gold-bright hover:underline">
                                            {m.country}
                                        </a>
                                        <div className="text-[11px] text-muted-foreground">{m.region} · {m.currency}</div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-display text-gold-bright">
                                        {curr === "bdt"
                                            ? fmtBDT(m.bdt)
                                            : `${m.currency} ${fmtNum(m.local, 2)}`}
                                        <div className="text-[11px] text-muted-foreground">
                                            1 {m.currency} = ৳ {fmtNum(m.fxToBdt, 2)}
                                        </div>
                                    </td>
                                    <td className={"px-4 py-3 text-right " + (isBd ? "text-muted-foreground" : cheaper ? "text-up" : "text-down")}>
                                        {isBd ? "Baseline" : `${fmtBDT(Math.abs(m.diff))} ${cheaper ? "cheaper" : "higher"}`}
                                    </td>
                                </tr>
                            );
                        })}
                        {/* Append Bangladesh as a baseline row */}
                        <tr className="bg-gold/5">
                            <td className="px-4 py-3">
                                <span className="font-medium text-gold-bright">Bangladesh</span>
                                <div className="text-[11px] text-muted-foreground">Bangladesh · BDT</div>
                            </td>
                            <td className="px-4 py-3 text-right font-display text-gold-bright">{fmtBDT(rows.baselineBdt)}</td>
                            <td className="px-4 py-3 text-right text-muted-foreground">Baseline</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <ul className="mt-5 text-[11px] text-muted-foreground space-y-1 font-bn">
                <li>বাংলাদেশের দাম BAJUS প্রকাশিত সর্বশেষ ২২ ক্যারেট রেট থেকে নেওয়া।</li>
                <li>বিদেশি বাজারের সারিগুলো নির্বাচিত উৎস থেকে; making charge, VAT ও spread যোগ হলে দাম আলাদা হতে পারে।</li>
                <li>BDT তুলনা আনুমানিক FX rate দিয়ে করা; remittance বা card rate ভিন্ন হতে পারে।</li>
            </ul>
        </div>
    );
}

function Toggle<T extends string>({
    label, value, setValue, opts,
}: { label: string; value: T; setValue: (v: T) => void; opts: T[] }) {
    return (
        <div>
            <label className="block text-xs uppercase tracking-widest text-gold-dim">{label}</label>
            <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${opts.length}, 1fr)` }}>
                {opts.map((o) => {
                    const active = o === value;
                    return (
                        <button
                            key={o}
                            onClick={() => setValue(o)}
                            className={
                                "py-2.5 rounded-xl text-xs font-medium border transition-colors uppercase " +
                                (active
                                    ? "bg-gold text-primary-foreground border-gold"
                                    : "bg-background/30 border-gold/20 text-muted-foreground hover:text-gold hover:border-gold/40")
                            }
                        >
                            {o}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
