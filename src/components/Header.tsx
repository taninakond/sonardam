import { Coins, RefreshCw, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { usePrices, useSyncPrices } from "@/lib/usePrices";

const links: { label: string; to: string }[] = [
    { label: "Prices", to: "/" },
    { label: "Calculator", to: "/calculator" },
    { label: "Calendar", to: "/calendar" },
    { label: "International", to: "/international" },
];

function formatUpdated(iso: string) {
    try {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return iso;
    }
}

export function Header() {
    const { prices, isFetching } = usePrices();
    const sync = useSyncPrices();

    return (
        <header className="sticky top-9 z-40 h-16 border-b border-gold/10 bg-[oklch(0.14_0.018_260/0.92)] backdrop-blur-md">
            <div className="mx-auto max-w-6xl h-full px-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <span className="grid place-items-center size-9 rounded-xl bg-gold/10 border border-gold/30">
                        <Coins className="size-5 text-gold" />
                    </span>
                    <span className="flex flex-col leading-none">
                        <span className="font-display text-xl font-bold text-gold-bright">SonarDam</span>
                        <span className="font-bn text-[11px] text-muted-foreground mt-1">সোনার দাম</span>
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-7 text-sm">
                    {links.map(({ label, to }) => (
                        <Link
                            key={to}
                            to={to}
                            activeOptions={{ exact: true }}
                            activeProps={{ className: "text-gold" }}
                            inactiveProps={{ className: "text-muted-foreground" }}
                            className="hover:text-gold transition-colors"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <span
                        className="hidden sm:inline text-[11px] text-muted-foreground"
                        title={`Source: ${prices.source}${prices.note ? ` (${prices.note})` : ""}`}
                    >
                        {prices.source === "bajus" ? "BAJUS" : "Cached"} · {formatUpdated(prices.fetchedAt)}
                    </span>
                    <button
                        onClick={() => sync()}
                        disabled={isFetching}
                        className="grid place-items-center size-9 rounded-lg border border-gold/20 hover:border-gold/50 hover:text-gold transition-colors disabled:opacity-50"
                        aria-label="Sync prices from BAJUS"
                        title="Sync prices from BAJUS"
                    >
                        {isFetching ? (
                            <Loader2 className="size-4 animate-spin text-gold" />
                        ) : (
                            <RefreshCw className="size-4" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
