import { component$ } from "@builder.io/qwik";

export const BackgroundGlow = component$(() => {
  return (
    <div
      aria-hidden="true"
      class="pointer-events-none fixed top-0 left-1/2 -z-10 h-[520px] sm:h-[640px] lg:h-[760px] w-[90vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),rgba(99,102,241,0.06)_42%,transparent_72%)] blur-[90px] sm:blur-[120px] lg:blur-[140px]"
    />
  );
});
