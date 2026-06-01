export function Footer() {
    return (
        <footer id="about" className="border-t border-gold/10 mt-10">
            <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
                <div>
                    <p className="font-display text-xl text-gold-bright">SonarDam</p>
                    <p className="font-bn text-xs text-muted-foreground mt-1">সোনার দাম — বাংলাদেশ</p>
                    <p className="text-muted-foreground mt-4 leading-relaxed">
                        Daily BAJUS-certified gold prices for Bangladesh, with conversions across Bhori,
                        Gram, Point and international units.
                    </p>
                </div>
                <div>
                    <p className="text-xs uppercase tracking-widest text-gold-dim">Units we support</p>
                    <ul className="mt-3 space-y-1.5 text-muted-foreground">
                        <li>Bhori (ভরি) — 11.664 g</li>
                        <li>Ana (আনা) — 1/16 Bhori · 0.729 g</li>
                        <li>Roti (রতি) — 1/96 Bhori · 0.1215 g</li>
                        <li>Point (পয়েন্ট) — 1/960 Bhori · 0.01215 g</li>
                        <li>Gram, Tola, Troy Ounce, Kilogram</li>
                    </ul>
                </div>
                <div>
                    <p className="text-xs uppercase tracking-widest text-gold-dim">Data source</p>
                    <p className="text-muted-foreground mt-3 leading-relaxed">
                        Bangladesh Jewellers Samity (BAJUS). 404 records spanning 2007–2026.
                        Rates are indicative and may vary at point of sale.
                    </p>
                </div>
            </div>
            <div className="border-t border-gold/10 py-5 text-center text-xs text-muted-foreground">
                © 2026 SonarDam — Built for Bangladesh
            </div>
        </footer>
    );
}
