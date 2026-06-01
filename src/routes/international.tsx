import { createFileRoute } from "@tanstack/react-router";
import { Ticker } from "@/components/Ticker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InternationalPanel } from "@/components/InternationalPanel";

export const Route = createFileRoute("/international")({
    head: () => ({
        meta: [
            { title: "International Gold Prices vs Bangladesh — SonarDam" },
            { name: "description", content: "Compare today's 22K gold prices in Dubai, Saudi Arabia, Malaysia, USA, UK and more against BAJUS Bangladesh rates." },
            { property: "og:title", content: "International Gold Prices — SonarDam" },
            { property: "og:description", content: "Live comparison of gold rates across Middle East, Asia, Europe and North America vs Bangladesh." },
        ],
    }),
    component: InternationalPage,
});

function InternationalPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Ticker />
            <Header />
            <main className="mx-auto max-w-5xl px-4 py-12">
                <div className="mb-8">
                    <p className="text-xs uppercase tracking-widest text-gold-dim">Compare</p>
                    <h1 className="font-display text-4xl text-gold-bright mt-2">International vs Bangladesh</h1>
                    <p className="font-bn text-sm text-muted-foreground mt-2">
                        মধ্যপ্রাচ্য, মালয়েশিয়া, ইউরোপ ও যুক্তরাষ্ট্রে থাকা বাংলাদেশিদের জন্য আজকের ২২ ক্যারেট স্বর্ণের তুলনা।
                    </p>
                </div>
                <InternationalPanel />
            </main>
            <Footer />
        </div>
    );
}
