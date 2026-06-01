import { createFileRoute } from "@tanstack/react-router";
import { Ticker } from "@/components/Ticker";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PriceGrid } from "@/components/PriceGrid";
import { Converter } from "@/components/Converter";
import { HistoryChart } from "@/components/HistoryChart";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "SonarDam — Today's Gold Price in Bangladesh (BAJUS)" },
            {
                name: "description",
                content:
                    "Live BAJUS gold prices for 22K, 21K, 18K and Traditional gold in Bangladesh. Convert between Bhori, Gram, Point, Tola, Troy Ounce and Kilogram.",
            },
            { property: "og:title", content: "SonarDam — সোনার দাম" },
            {
                property: "og:description",
                content:
                    "Today's BAJUS gold rates with a converter for Bhori, Gram, Point and international units.",
            },
        ],
    }),
    component: Index,
});

function Index() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Ticker />
            <Header />
            <main>
                <Hero />
                <PriceGrid />
                <Converter />
                <HistoryChart />
            </main>
            <Footer />
        </div>
    );
}
