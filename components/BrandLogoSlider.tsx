export function BrandLogoSlider() {
  const brands = [
    {
      name: "Linear",
      svg: (
        <svg
          viewBox="0 0 115 30"
          fill="none"
          className="h-7 sm:h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Linear logo"
        >
          <circle cx="15" cy="15" r="13" stroke="currentColor" strokeWidth="2.4" />
          <path
            d="M8 8l14 14M8 15l7 7M15 8l7 7"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <text
            x="36"
            y="21"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="19"
            fontWeight="700"
            fill="currentColor"
            letterSpacing="-0.3"
          >
            Linear
          </text>
        </svg>
      ),
    },
    {
      name: "Supabase",
      svg: (
        <svg
          viewBox="0 0 145 30"
          fill="none"
          className="h-7 sm:h-8 w-auto opacity-85 hover:opacity-100 transition-opacity"
          aria-label="Supabase logo"
        >
          <path
            d="M15 2c.8-1 2.3-.4 2.3.8v10.5h8.5c1.2 0 1.8 1.4 1 2.2l-12 13.5c-.8 1-2.3.4-2.3-.8V17H4c-1.2 0-1.8-1.4-1-2.2L15 2z"
            fill="#3ECF8E"
          />
          <text
            x="35"
            y="21"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="20"
            fontWeight="700"
            fill="currentColor"
            letterSpacing="-0.5"
          >
            supabase
          </text>
        </svg>
      ),
    },
    {
      name: "Claude",
      svg: (
        <svg
          viewBox="0 0 125 30"
          fill="none"
          className="h-7 sm:h-8 w-auto opacity-85 hover:opacity-100 transition-opacity"
          aria-label="Claude logo"
        >
          <path
            d="M13 5l2 5.5 5.5-2-3 4.5 4.5 3.5-5.5 1 1 5.5-4.5-3.5-3.5 4.5-1-5.5-5.5-1 4.5-3.5-3-4.5 5.5 2 2-5.5z"
            fill="#D97706"
          />
          <text
            x="29"
            y="22"
            fontFamily="Georgia, serif"
            fontSize="21"
            fontWeight="700"
            fill="currentColor"
            letterSpacing="-0.2"
          >
            Claude
          </text>
        </svg>
      ),
    },
    {
      name: "OpenAI",
      svg: (
        <svg
          viewBox="0 0 130 30"
          fill="none"
          className="h-7 sm:h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
          aria-label="OpenAI logo"
        >
          <g transform="translate(1, 2) scale(0.72)">
            <path
              d="M28.5 16.5A10.5 10.5 0 0 0 18 6.02v3.7a6.8 6.8 0 0 1 6.8 6.78h3.7zm-2.45-8.2a10.5 10.5 0 0 0-14.37-3.9l1.86 3.2a6.8 6.8 0 0 1 9.3 2.53l3.21-1.83zm-10.4-4.8A10.5 10.5 0 0 0 5.17 11.4l3.2 1.86a6.8 6.8 0 0 1 6.8-5.32V4.24zm-7.96 10.7a10.5 10.5 0 0 0 3.86 14.38l1.85-3.21a6.8 6.8 0 0 1-2.52-9.31l-3.2-1.86zm4.8 10.4a10.5 10.5 0 0 0 10.5 0v-3.7a6.8 6.8 0 0 1-6.8-1.46l-3.7 5.16zm12.84-.73a10.5 10.5 0 0 0 3.9-14.38l-3.2 1.86a6.8 6.8 0 0 1 2.52 9.31l-3.22 3.21z"
              fill="currentColor"
            />
          </g>
          <text
            x="32"
            y="21"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="20"
            fontWeight="600"
            fill="currentColor"
            letterSpacing="-0.3"
          >
            OpenAI
          </text>
        </svg>
      ),
    },
    {
      name: "Gemini",
      svg: (
        <svg
          viewBox="0 0 130 30"
          fill="none"
          className="h-7 sm:h-8 w-auto opacity-85 hover:opacity-100 transition-opacity"
          aria-label="Gemini logo"
        >
          <path
            d="M13 2c0 6-5 11-11 11 6 0 11 5 11 11 0-6 5-11 11-11-6 0-11-5-11-11z"
            fill="#4285F4"
          />
          <text
            x="31"
            y="21"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="20"
            fontWeight="700"
            fill="currentColor"
            letterSpacing="-0.4"
          >
            Gemini
          </text>
        </svg>
      ),
    },
    {
      name: "Figma",
      svg: (
        <svg
          viewBox="0 0 115 30"
          fill="none"
          className="h-7 sm:h-8 w-auto opacity-85 hover:opacity-100 transition-opacity"
          aria-label="Figma logo"
        >
          <g transform="translate(1, 1)">
            <path
              d="M5 0h5a5 5 0 0 1 5 5 5 5 0 0 1-5 5H5a5 5 0 0 1-5-5 5 5 0 0 1 5-5z"
              fill="#F24E1E"
            />
            <path
              d="M15 5a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-5a5 5 0 0 1-5-5z"
              fill="#FF7262"
            />
            <path
              d="M15 14a5 5 0 0 1 5-5h5a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-5a5 5 0 0 1-5-5z"
              fill="#1ABCFE"
            />
            <path
              d="M5 9h5a5 5 0 0 1 5 5 5 5 0 0 1-5 5H5a5 5 0 0 1-5-5 5 5 0 0 1 5-5z"
              fill="#A259FF"
            />
            <path
              d="M5 19h5a5 5 0 0 1 5 5v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5v-4a5 5 0 0 1-5-5z"
              fill="#0ACF83"
            />
          </g>
          <text
            x="35"
            y="22"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="19"
            fontWeight="700"
            fill="currentColor"
            letterSpacing="-0.3"
          >
            Figma
          </text>
        </svg>
      ),
    },
    {
      name: "Clerk",
      svg: (
        <svg
          viewBox="0 0 105 30"
          fill="none"
          className="h-7 sm:h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Clerk logo"
        >
          <path
            d="M10 4C6 4 2.5 7.5 2.5 12s3.5 8 7.5 8c3.5 0 6.5-2.2 7.5-5.5a1.2 1.2 0 0 0-2.3-1A5.5 5.5 0 0 1 10 17.5c-3 0-5.5-2.5-5.5-5.5S7 6.5 10 6.5c2 0 3.8 1.1 4.7 2.8a1.2 1.2 0 1 0 2.1-1.2C15.5 5.5 13 4 10 4z"
            fill="currentColor"
          />
          <text
            x="25"
            y="21"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="20"
            fontWeight="700"
            fill="currentColor"
            letterSpacing="-0.4"
          >
            clerk
          </text>
        </svg>
      ),
    },
    {
      name: "NVIDIA",
      svg: (
        <svg
          viewBox="0 0 120 30"
          fill="currentColor"
          className="h-6 sm:h-7 w-auto opacity-80 hover:opacity-100 transition-opacity"
          aria-label="NVIDIA logo"
        >
          <path d="M2.5 14C2.5 8.2 7.2 3.5 13 3.5c4.1 0 7.7 2.4 9.4 5.9.3.6-.1 1.3-.7 1.4-.6.1-1.2-.2-1.5-.7-1.4-2.8-4.2-4.6-7.2-4.6-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5c3.3 0 6.2-1.9 7.5-4.8.2-.5.8-.8 1.4-.6.6.2.9.8.7 1.4-1.7 3.8-5.4 6-9.6 6-5.8 0-10.5-4.7-10.5-10.5z" />
          <text
            x="28"
            y="20"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="18"
            fontWeight="800"
            letterSpacing="0.5"
          >
            nVIDIA.
          </text>
        </svg>
      ),
    },
    {
      name: "Turso",
      svg: (
        <svg
          viewBox="0 0 110 30"
          fill="none"
          className="h-6 sm:h-7 w-auto opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Turso logo"
        >
          <path
            d="M3 4c1-2 4-2 6-1 2-1 5-1 6 1 1 2 0 5-1 7l-5 7-5-7C3 9 2 6 3 4z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="6.5" cy="7.5" r="1.2" fill="currentColor" />
          <circle cx="11.5" cy="7.5" r="1.2" fill="currentColor" />
          <text
            x="25"
            y="20"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="18"
            fontWeight="800"
            fill="currentColor"
            letterSpacing="1"
          >
            TURSO
          </text>
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full pt-10 sm:pt-14 pb-2">
      {/* Edge-faded Infinite Marquee Slider with 100% transparent vector SVGs */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] py-3">
        <div className="animate-marquee flex items-center gap-14 sm:gap-20 text-foreground">
          {/* First set of brands */}
          {brands.map((brand, idx) => (
            <div
              key={`b1-${idx}`}
              className="flex items-center justify-center flex-shrink-0 cursor-default"
              title={brand.name}
            >
              {brand.svg}
            </div>
          ))}

          {/* Second duplicated set for seamless infinite scroll */}
          {brands.map((brand, idx) => (
            <div
              key={`b2-${idx}`}
              className="flex items-center justify-center flex-shrink-0 cursor-default"
              title={brand.name}
            >
              {brand.svg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
