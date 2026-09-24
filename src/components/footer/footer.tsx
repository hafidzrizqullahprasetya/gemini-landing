import { component$ } from "@builder.io/qwik";

export const Footer = component$(() => {
  return (
    <footer class="w-full border-t border-white/8 py-6 sm:py-8 text-center text-xs text-neutral-500">
      <div class="container-wrap">
        <p class="text-neutral-400">
          © 2026 Octane (octane.web.id). Seluruh hak cipta dilindungi.
        </p>
        <p class="mt-1.5 text-[11px] sm:text-xs text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Penafian: Octane adalah penyedia independen aktivasi digital promo dan
          tidak berafiliasi resmi dengan Google LLC atau Alphabet Inc.
        </p>
      </div>
    </footer>
  );
});
