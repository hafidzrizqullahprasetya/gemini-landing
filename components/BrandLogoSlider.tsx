export function BrandLogoSlider() {
  const brandLogos = [
    {
      name: "Linear",
      lightSrc: "/logos-clean/linear.png",
      darkSrc: "/logos-clean/linear_dark.png",
    },
    {
      name: "Supabase",
      lightSrc: "/logos-clean/supabase.png",
      darkSrc: "/logos-clean/supabase_dark.png",
    },
    {
      name: "Claude",
      lightSrc: "/logos-clean/claude.png",
      darkSrc: "/logos-clean/claude_dark.png",
    },
    {
      name: "ChatGPT",
      lightSrc: "/logos-clean/chatgpt.png",
      darkSrc: "/logos-clean/chatgpt_dark.png",
    },
    {
      name: "Gemini",
      lightSrc: "/logos-clean/gemini.png",
      darkSrc: "/logos-clean/gemini_dark.png",
    },
    {
      name: "Figma",
      lightSrc: "/logos-clean/figma.png",
      darkSrc: "/logos-clean/figma_dark.png",
    },
    {
      name: "Notion",
      lightSrc: "/logos-clean/notion.png",
      darkSrc: "/logos-clean/notion_dark.png",
    },
    {
      name: "Railway",
      lightSrc: "/logos-clean/railway.png",
      darkSrc: "/logos-clean/railway_dark.png",
    },
    {
      name: "PostHog",
      lightSrc: "/logos-clean/posthog.png",
      darkSrc: "/logos-clean/posthog_dark.png",
    },
    {
      name: "Resend",
      lightSrc: "/logos-clean/resend.png",
      darkSrc: "/logos-clean/resend_dark.png",
    },
    {
      name: "Grok",
      lightSrc: "/logos-clean/grok.png",
      darkSrc: "/logos-clean/grok_dark.png",
    },
    {
      name: "Coursera",
      lightSrc: "/logos-clean/coursera.png",
      darkSrc: "/logos-clean/coursera_dark.png",
    },
    {
      name: "JetBrains",
      lightSrc: "/logos-clean/jetbrains.png",
      darkSrc: "/logos-clean/jetbrains_dark.png",
    },
    {
      name: "Bolt",
      lightSrc: "/logos-clean/bolt.png",
      darkSrc: "/logos-clean/bolt_dark.png",
    },
    {
      name: "Arize",
      lightSrc: "/logos-clean/arize.png",
      darkSrc: "/logos-clean/arize_dark.png",
    },
  ];

  return (
    <div className="w-full pt-14 sm:pt-18 pb-4">
      {/* Edge-faded Infinite Marquee Slider with 100% transparent extracted brand logos */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] py-2">
        <div className="animate-marquee flex items-center gap-14 sm:gap-18">
          {/* First set of brands */}
          {brandLogos.map((brand, idx) => (
            <div
              key={`b1-${idx}`}
              className="flex items-center justify-center flex-shrink-0 cursor-default"
              title={brand.name}
            >
              <img
                src={brand.lightSrc}
                alt={brand.name}
                loading="lazy"
                className="slider-logo-light h-8 sm:h-9 md:h-10 w-auto max-w-[150px] sm:max-w-[175px] object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
              <img
                src={brand.darkSrc}
                alt={brand.name}
                loading="lazy"
                className="slider-logo-dark h-8 sm:h-9 md:h-10 w-auto max-w-[150px] sm:max-w-[175px] object-contain opacity-85 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}

          {/* Second duplicated set for seamless infinite marquee loop */}
          {brandLogos.map((brand, idx) => (
            <div
              key={`b2-${idx}`}
              className="flex items-center justify-center flex-shrink-0 cursor-default"
              title={brand.name}
            >
              <img
                src={brand.lightSrc}
                alt={brand.name}
                loading="lazy"
                className="slider-logo-light h-8 sm:h-9 md:h-10 w-auto max-w-[150px] sm:max-w-[175px] object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
              <img
                src={brand.darkSrc}
                alt={brand.name}
                loading="lazy"
                className="slider-logo-dark h-8 sm:h-9 md:h-10 w-auto max-w-[150px] sm:max-w-[175px] object-contain opacity-85 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
