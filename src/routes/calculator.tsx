import { createFileRoute } from "@tanstack/react-router";
import { Ticker } from "@/components/Ticker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CalculatorPanel } from "@/components/CalculatorPanel";

export const Route = createFileRoute("/calculator")({
    head: () => ({
        meta: [
            { title: "Gold Price Calculator (Bhori, Ana, Roti, Point) — SonarDam" },
            { name: "description", content: "Calculate the price of gold in Bangladesh by Bhori, Ana, Roti, Point or Gram across 22K, 21K, 18K and Traditional." },
            { property: "og:title", content: "Gold Price Calculator — SonarDam" },
            { property: "og:description", content: "Convert weight ↔ price across all Bangladeshi gold units instantly." },
        ],
    }),
    component: CalculatorPage,
});

function CalculatorPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Ticker />
            <Header />
            <main className="mx-auto max-w-3xl px-4 py-12">
                <div className="mb-8">
                    <p className="text-xs uppercase tracking-widest text-gold-dim">Tool</p>
                    <h1 className="font-display text-4xl text-gold-bright mt-2">Gold Price Calculator</h1>
                    <p className="font-bn text-sm text-muted-foreground mt-2">
                        গ্রাম, ভরি, আনা, রতি বা পয়েন্ট দিয়ে বাংলাদেশে স্বর্ণের দাম হিসাব করুন।
                    </p>
                </div>
                <CalculatorPanel />
            </main>
            <Footer />
        </div>
    );
}
