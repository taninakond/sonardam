import { createFileRoute } from "@tanstack/react-router";
import { Ticker } from "@/components/Ticker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CalendarPanel } from "@/components/CalendarPanel";

export const Route = createFileRoute("/calendar")({
    head: () => ({
        meta: [
            { title: "Gold Price by Date (BAJUS Calendar) — SonarDam" },
            { name: "description", content: "Look up Bangladesh gold prices (22K, 21K, 18K) on any date from 2007 to today. Nearest known dates are shown when the day isn't in BAJUS records." },
            { property: "og:title", content: "Gold Price Calendar — SonarDam" },
            { property: "og:description", content: "Historical BAJUS gold prices by exact date." },
        ],
    }),
    component: CalendarPage,
});

function CalendarPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Ticker />
            <Header />
            <main className="mx-auto max-w-3xl px-4 py-12">
                <div className="mb-8">
                    <p className="text-xs uppercase tracking-widest text-gold-dim">Tool</p>
                    <h1 className="font-display text-4xl text-gold-bright mt-2">Gold Price by Date</h1>
                    <p className="font-bn text-sm text-muted-foreground mt-2">
                        নির্দিষ্ট দিনের BAJUS স্বর্ণের দাম দেখুন; দিনটি না থাকলে কাছের আগের ও পরের দাম দেখানো হবে।
                    </p>
                </div>
                <CalendarPanel />
            </main>
            <Footer />
        </div>
    );
}
