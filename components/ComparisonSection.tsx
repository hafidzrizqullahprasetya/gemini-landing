import { Check, X, Flame, Zap, Shield, Database, Clock } from "lucide-react";

export function ComparisonSection() {
  const comparisonItems = [
    {
      feature: "Ketersediaan Stok",
      octane: "Real-Time API Server (Tertera persis detik ini, tanpa PHP)",
      others: "Stok manual/perkiraan (sering kosong setelah transfer)",
      icon: Database,
    },
    {
      feature: "Kelengkapan Katalog",
      octane: "100+ Varian (AI, Token API Claude/Codex, Dev Tools, Edu, Hiburan)",
      others: "Hanya 5–15 produk umum (terbatas Canva & Gemini biasa)",
      icon: Zap,
    },
    {
      feature: "Kecepatan Pengiriman",
      octane: "Rata-rata 2–5 Menit (Filosofi bahan bakar instan)",
      others: "Menunggu chat manual admin berjam-jam",
      icon: Clock,
    },
    {
      feature: "Kejelasan Garansi",
      octane: "SLA Tertulis Transparan (Full Warranty, W25D, W5D) + Klaim 1-Klik",
      others: "Garansi tidak jelas, sering lepas tangan saat kendala",
      icon: Shield,
    },
    {
      feature: "Kelengkapan Kredensial 2FA",
      octane: "Lengkap Email, Password, dan 2FA Secret Key siap autentikasi",
      others: "Hanya user/pass mentah, akun sering terkunci tanpa 2FA",
      icon: Check,
    },
  ];

  return (
    <section id="keunggulan" className="py-14 sm:py-20 border-b hairline-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary font-semibold uppercase tracking-wider">
            <Flame className="h-3.5 w-3.5" />
            <span>Keunggulan Kompetitif</span>
            <span>·</span>
            <span>Mengapa Octane Lebih Unggul</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground font-display mt-1">
            Bukan Sekadar Seller Akun Biasa.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
            Dibangun dengan infrastruktur reseller modern yang mengutamakan kecepatan, presisi stok, dan kepastian garansi.
          </p>
        </div>

        {/* Comparison Matrix */}
        <div className="rounded-xl border hairline-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b hairline-border bg-muted/40 font-mono text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 text-muted-foreground font-medium w-1/3">
                    Parameter Layanan
                  </th>
                  <th className="py-4 px-6 text-primary font-bold w-1/3 bg-primary/5 border-x hairline-border">
                    <span className="flex items-center gap-1.5">
                      <Flame className="h-4 w-4" />
                      <span>OCTANE (octane.web.id)</span>
                    </span>
                  </th>
                  <th className="py-4 px-6 text-muted-foreground font-medium w-1/3">
                    Kompetitor Konvensional
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y hairline-border">
                {comparisonItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span>{item.feature}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-foreground bg-primary/5 border-x hairline-border">
                        <div className="flex items-start gap-2 text-primary font-sans text-xs sm:text-sm">
                          <Check className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-500" />
                          <span>{item.octane}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-xs sm:text-sm">
                        <div className="flex items-start gap-2">
                          <X className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-500/80" />
                          <span>{item.others}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
