import { useEffect, useRef, useState } from "react";
import { UNIT_TO_GRAM, fmtBDT } from "@/lib/goldCalc";
import { usePrices, pricePerGramOf, type Karat } from "@/lib/usePrices";
import { Coins } from "lucide-react";

const karats: { k: Karat; label: string }[] = [
    { k: 22, label: "22k" },
    { k: 21, label: "21k" },
    { k: 18, label: "18k" },
    { k: 24, label: "Traditional" },
];

// Independent weight buckets — all summed into total grams.
// 1 Bhori = 11.664 g = 16 Ana = 96 Roti = 960 Point
type WUnit = "bhori" | "ana" | "roti" | "point" | "gram";
const W_TO_GRAM: Record<WUnit, number> = {
    bhori: UNIT_TO_GRAM.bhori,
    ana: UNIT_TO_GRAM.bhori / 16,
    roti: UNIT_TO_GRAM.bhori / 96,
    point: UNIT_TO_GRAM.bhori / 960,
    gram: 1,
};

const W_LABEL: Record<WUnit, string> = {
    bhori: "Bhori (ভরি)",
    ana: "Ana (আনা)",
    roti: "Roti (রতি)",
    point: "Point (পয়েন্ট)",
    gram: "Gram (গ্রাম)",
};

const fmt = (n: number, d = 4) => {
    if (!isFinite(n) || n === 0) return "0";
    return n.toFixed(d).replace(/\.?0+$/, "");
};

function NumField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (raw: string) => void;
}) {
    return (
        <div>
            <label className="block text-[11px] uppercase tracking-widest text-gold-dim">
                {label}
            </label>
            <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={(e) => e.currentTarget.select()}
                className="mt-2 w-full bg-background/40 border border-gold/25 rounded-xl px-3 py-2.5 text-lg font-display text-gold-bright outline-none focus:border-gold/60"
            />
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-gold-bright font-display text-right">{value}</dd>
        </div>
    );
}

export function CalculatorPanel() {
    const { prices } = usePrices();
    const [karat, setKarat] = useState<Karat>(22);

    // Composite weight: each bucket is an independent string the user types.
    const [w, setW] = useState<Record<WUnit, string>>({
        bhori: "1",
        ana: "0",
        roti: "0",
        point: "0",
        gram: "0",
    });

    // Rate per gram (editable). Snaps to BAJUS for selected karat unless user overrode.
    const [rate, setRate] = useState<number>(pricePerGramOf(prices, 22));
    const [rateDraft, setRateDraft] = useState<{ field: "g" | "b"; value: string } | null>(null);
    const rateOverridden = useRef(false);

    // When karat or live prices change, snap the rate (unless user overrode this session).
    useEffect(() => {
        if (!rateOverridden.current) {
            setRate(pricePerGramOf(prices, karat));
        }
    }, [karat, prices]);

    // Reset override when karat changes — pick up new karat's BAJUS rate.
    useEffect(() => {
        rateOverridden.current = false;
        setRate(pricePerGramOf(prices, karat));
        setRateDraft(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [karat]);

    const setUnit = (u: WUnit, raw: string) => {
        setW((prev) => ({ ...prev, [u]: raw }));
    };

    const parse = (raw: string) => {
        const n = Number(raw);
        return Number.isFinite(n) && n >= 0 ? n : 0;
    };

    const totalGrams =
        parse(w.bhori) * W_TO_GRAM.bhori +
        parse(w.ana) * W_TO_GRAM.ana +
        parse(w.roti) * W_TO_GRAM.roti +
        parse(w.point) * W_TO_GRAM.point +
        parse(w.gram) * W_TO_GRAM.gram;

    const total = totalGrams * rate;

    const ratePerBhori = rate * UNIT_TO_GRAM.bhori;

    const rateGramValue =
        rateDraft?.field === "g" ? rateDraft.value : fmt(rate, 2);
    const rateBhoriValue =
        rateDraft?.field === "b" ? rateDraft.value : fmt(ratePerBhori, 0);

    const onRateChange = (field: "g" | "b", raw: string) => {
        rateOverridden.current = true;
        setRateDraft({ field, value: raw });
        if (raw.trim() === "") {
            setRate(0);
            return;
        }
        const n = Number(raw);
        if (!Number.isFinite(n)) return;
        setRate(field === "g" ? n : n / UNIT_TO_GRAM.bhori);
    };

    const clearAll = () => {
        setW({ bhori: "0", ana: "0", roti: "0", point: "0", gram: "0" });
    };

    const resetRate = () => {
        rateOverridden.current = false;
        setRate(pricePerGramOf(prices, karat));
        setRateDraft(null);
    };

    return (
        <div className="gold-card p-6 sm:p-8">
            {/* Karat */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="inline-flex p-1 rounded-2xl border border-gold/25 bg-background/30">
                    {karats.map(({ k, label }) => {
                        const active = k === karat;
                        return (
                            <button
                                key={k}
                                onClick={() => setKarat(k)}
                                className={
                                    "px-4 sm:px-5 py-2 rounded-xl text-sm font-medium transition-colors " +
                                    (active
                                        ? "bg-gold text-primary-foreground"
                                        : "text-muted-foreground hover:text-gold")
                                }
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-gold underline underline-offset-4"
                >
                    Clear weights
                </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.95fr]">
                {/* Composite weight inputs */}
                <div>
                    <p className="text-[11px] uppercase tracking-widest text-gold-dim mb-3">
                        Weight (combine units)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {(["bhori", "ana", "roti", "point", "gram"] as WUnit[]).map((u) => (
                            <NumField
                                key={u}
                                label={W_LABEL[u]}
                                value={w[u]}
                                onChange={(v) => setUnit(u, v)}
                            />
                        ))}
                    </div>
                    <p className="mt-3 text-[11px] text-muted-foreground font-bn">
                        উদাহরণ: 0 ভরি · 1 আনা · 2 রতি · 3 পয়েন্ট — সব একসাথে যোগ হয়ে মোট ওজন।
                    </p>

                    <div className="mt-6 pt-5 border-t border-border/60">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[11px] uppercase tracking-widest text-gold-dim">Rate</p>
                            <button
                                onClick={resetRate}
                                className="text-[11px] text-muted-foreground hover:text-gold underline underline-offset-4"
                            >
                                Use BAJUS rate
                            </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <NumField
                                label="Rate / Gram"
                                value={rateGramValue}
                                onChange={(v) => onRateChange("g", v)}
                            />
                            <NumField
                                label="Rate / Bhori"
                                value={rateBhoriValue}
                                onChange={(v) => onRateChange("b", v)}
                            />
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <aside className="rounded-2xl border border-gold/25 bg-gold/5 p-6 self-start">
                    <p className="text-xs uppercase tracking-widest text-gold-dim flex items-center gap-2">
                        <Coins className="size-3.5" /> Estimated Total
                    </p>
                    <p className="price-number font-display text-4xl sm:text-5xl font-bold mt-3 break-words">
                        {fmtBDT(total)}
                    </p>
                    <dl className="mt-6 space-y-3 text-sm border-t border-gold/15 pt-5">
                        <Row label="Total weight (g)" value={`${fmt(totalGrams, 3)} g`} />
                        <Row label="Total weight (Bhori)" value={fmt(totalGrams / W_TO_GRAM.bhori)} />
                        <Row label="Rate / Gram" value={fmtBDT(rate)} />
                        <Row label="Rate / Bhori" value={fmtBDT(ratePerBhori)} />
                    </dl>
                    <p className="mt-5 text-[11px] text-muted-foreground">
                        Rate source: {prices.source === "bajus" ? "BAJUS live" : "Cached fallback"} ·{" "}
                        {new Date(prices.fetchedAt).toLocaleDateString()}
                    </p>
                </aside>
            </div>

            <ul className="mt-8 text-[11px] text-muted-foreground space-y-1 font-bn border-t border-border/60 pt-5">
                <li>১ ভরি = ১১.৬৬৪ গ্রাম = ১৬ আনা = ৯৬ রতি = ৯৬০ পয়েন্ট।</li>
                <li>মোট দাম শুধু স্বর্ণের ওজন ও রেটের ভিত্তিতে হিসাব করা; ভ্যাট ও মজুরি যোগ করা হয়নি।</li>
            </ul>
        </div>
    );
}
