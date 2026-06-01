import { useMemo, useState } from "react";
import {
    type Unit,
    UNIT_TO_GRAM,
    UNIT_LABEL,
    UNIT_GROUPS,
    toGrams,
    fmtBDT,
    fmtNum,
} from "@/lib/goldCalc";
import { usePrices, pricePerGramOf, type Karat } from "@/lib/usePrices";
import { ArrowRight, Scale } from "lucide-react";

const karats: Karat[] = [24, 22, 21, 18];

export function Converter() {
    const { prices } = usePrices();
    const [weight, setWeight] = useState<string>("1");
    const [unit, setUnit] = useState<Unit>("bhori");
    const [karat, setKarat] = useState<Karat>(22);

    const w = Number(weight) || 0;
    const grams = useMemo(() => toGrams(w, unit), [w, unit]);
    const ppg = pricePerGramOf(prices, karat);
    const total = grams * ppg;

    const equivalents: { unit: Unit; value: number }[] = (
        ["bhori", "gram", "ana", "roti", "point", "tola", "oz", "kg"] as Unit[]
    )
        .filter((u) => u !== unit)
        .map((u) => ({ unit: u, value: grams / UNIT_TO_GRAM[u] }));

    return (
        <section id="converter" className="mx-auto max-w-6xl px-4 py-14">
            <div className="mb-8 flex items-center gap-3">
                <span className="grid place-items-center size-10 rounded-xl bg-gold/10 border border-gold/30">
                    <Scale className="size-5 text-gold" />
                </span>
                <div>
                    <h2 className="font-display text-3xl text-gold-bright">Gold Unit Converter</h2>
                    <p className="text-sm text-muted-foreground">
                        Convert across Bhori, Gram, Point and international units — and price it instantly.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
                {/* Inputs */}
                <div className="gold-card p-6 sm:p-8">
                    <label className="block text-xs uppercase tracking-widest text-gold-dim">Weight</label>
                    <div className="mt-2 flex items-stretch gap-2">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="flex-1 min-w-0 bg-background/40 border border-gold/25 rounded-xl px-4 py-3 text-2xl font-display text-gold-bright outline-none focus:border-gold/60"
                        />
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value as Unit)}
                            className="bg-background/40 border border-gold/25 rounded-xl px-3 py-3 text-base outline-none focus:border-gold/60"
                        >
                            {UNIT_GROUPS.map((g) => (
                                <optgroup key={g.label} label={g.label}>
                                    {g.units.map((u) => (
                                        <option key={u} value={u}>{UNIT_LABEL[u]}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <label className="block text-xs uppercase tracking-widest text-gold-dim mt-7">
                        Karat
                    </label>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                        {karats.map((k) => {
                            const active = k === karat;
                            return (
                                <button
                                    key={k}
                                    onClick={() => setKarat(k)}
                                    className={
                                        "py-3 rounded-xl text-sm font-medium border transition-colors " +
                                        (active
                                            ? "bg-gold text-primary-foreground border-gold"
                                            : "bg-background/30 border-gold/20 text-muted-foreground hover:text-gold hover:border-gold/40")
                                    }
                                >
                                    {k}K
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-7 pt-6 border-t border-border/60">
                        <p className="text-xs uppercase tracking-widest text-gold-dim">Estimated value</p>
                        <p className="price-number font-display text-4xl sm:text-5xl font-bold mt-2">
                            {fmtBDT(total)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {fmtNum(grams, 3)} g × {fmtBDT(ppg)} / g ({karat}K)
                        </p>
                    </div>
                </div>

                {/* Equivalents */}
                <div className="gold-card p-6 sm:p-8">
                    <div className="flex items-baseline justify-between">
                        <p className="text-xs uppercase tracking-widest text-gold-dim">Equivalents</p>
                        <p className="text-sm text-muted-foreground">
                            {fmtNum(w, 3)} {UNIT_LABEL[unit]}
                        </p>
                    </div>

                    <ul className="mt-5 divide-y divide-border/60">
                        {equivalents.map(({ unit: u, value }) => (
                            <li key={u} className="py-3.5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="grid place-items-center size-7 rounded-md bg-gold/10 border border-gold/20 text-gold text-[11px]">
                                        <ArrowRight className="size-3.5" />
                                    </span>
                                    <span className="text-sm text-muted-foreground truncate">{UNIT_LABEL[u]}</span>
                                </div>
                                <span className="font-display text-lg text-gold-bright">{fmtNum(value, 4)}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 pt-5 border-t border-border/60 grid grid-cols-2 gap-3 text-[11px] text-muted-foreground">
                        <p>1 Bhori = 11.664 g = 16 Ana</p>
                        <p>1 Ana = 6 Roti = 60 Point</p>
                        <p>1 Tola = 11.664 g</p>
                        <p>1 Troy Oz = 31.1035 g</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
