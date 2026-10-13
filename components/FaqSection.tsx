import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah akun yang disediakan siap pakai dan aman digunakan?",
      a: "Ya. Setiap produk diproses langsung melalui sistem aktivasi Octane Cloud yang telah teruji. Jenis pengiriman bervariasi antara akun baru siap login, tautan aktivasi mandiri (invite), atau lisensi resmi.",
    },
    {
      q: "Bagaimana cara membaca kode 2FA saat login akun Google atau OpenAI?",
      a: "Jika format pengiriman memuat kode 2FA (contoh: JBSWY3DPEHPK3PXP), buka situs seperti 2fa-auth.com atau aplikasi Google Authenticator, masukkan secret key tersebut untuk mendapatkan 6 digit kode OTP masuk.",
    },
    {
      q: "Berapa lama estimasi pengiriman setelah pembayaran?",
      a: "Untuk produk berstatus 'Ready Stock', pengiriman berkisar antara 2 hingga 10 menit setelah bukti pembayaran QRIS atau transfer divalidasi oleh admin.",
    },
    {
      q: "Metode pembayaran apa saja yang diterima?",
      a: "Kami menerima QRIS (mendukung GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, BRI, BNI) serta transfer antar-bank lokal tanpa biaya admin tambahan.",
    },
    {
      q: "Bagaimana prosedur jika akun terkendala atau error?",
      a: "Hubungi admin kami dengan menyertakan ID invoice transaksi dan bukti tangkapan layar kendala. Jika masih dalam masa garansi produk (FW/W-Days), akun pengganti akan segera diproses.",
    },
    {
      q: "Apakah saya bisa memesan dalam jumlah banyak untuk dijual kembali?",
      a: "Bisa. Tersedia tier harga grosir untuk pembelian partai besar (min 10-50 akun) pada produk-produk tertentu seperti Gemini 18M, Claude API, dan Microsoft 365.",
    },
  ];

  return (
    <section id="faq" className="py-14 sm:py-20 border-b hairline-border bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary font-semibold uppercase tracking-wider">
            <span>Tanya Jawab</span>
            <span>·</span>
            <span>Pertanyaan Umum</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground font-display mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Jawaban lengkap seputar akun, aktivasi, dan layanan garansi kami.
          </p>
        </div>

        <div className="divide-y hairline-border border hairline-border rounded-xl bg-card overflow-hidden">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left gap-4 hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:bg-muted/40"
                >
                  <span className="text-sm sm:text-base font-semibold text-foreground">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-foreground" : ""
                      }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
