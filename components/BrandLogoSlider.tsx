export function BrandLogoSlider() {
  const brands = [
    {
      name: "Claude",
      svg: (
        <svg
          viewBox="0 0 110 28"
          fill="currentColor"
          className="h-6 w-auto opacity-75 hover:opacity-100 transition-opacity"
          aria-label="Claude logo"
        >
          <text
            x="0"
            y="21"
            fontFamily="Georgia, serif"
            fontSize="22"
            fontWeight="bold"
            letterSpacing="-0.5"
          >
            Claude
          </text>
        </svg>
      ),
    },
    {
      name: "Clerk",
      svg: (
        <svg
          viewBox="0 0 100 28"
          fill="none"
          className="h-6 w-auto opacity-75 hover:opacity-100 transition-opacity"
          aria-label="Clerk logo"
        >
          <g transform="translate(0, 3)">
            <path
              d="M10 2.5C5.86 2.5 2.5 5.86 2.5 10s3.36 7.5 7.5 7.5c3.2 0 5.96-2.02 7.02-4.88a1.25 1.25 0 0 0-2.35-.85A5.006 5.006 0 0 1 10 15c-2.76 0-5-2.24-5-5s2.24-5 5-5c1.9 0 3.56 1.07 4.39 2.64a1.25 1.25 0 1 0 2.19-1.22C15.28 4.09 12.8 2.5 10 2.5z"
              fill="currentColor"
            />
          </g>
          <text
            x="24"
            y="19"
            fontFamily="-apple-system, sans-serif"
            fontSize="18"
            fontWeight="700"
            fill="currentColor"
            letterSpacing="-0.3"
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
          viewBox="0 0 120 28"
          fill="currentColor"
          className="h-5 w-auto opacity-75 hover:opacity-100 transition-opacity"
          aria-label="NVIDIA logo"
        >
          <path d="M2.5 14C2.5 8.2 7.2 3.5 13 3.5c4.1 0 7.7 2.4 9.4 5.9.3.6-.1 1.3-.7 1.4-.6.1-1.2-.2-1.5-.7-1.4-2.8-4.2-4.6-7.2-4.6-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5c3.3 0 6.2-1.9 7.5-4.8.2-.5.8-.8 1.4-.6.6.2.9.8.7 1.4-1.7 3.8-5.4 6-9.6 6-5.8 0-10.5-4.7-10.5-10.5z" />
          <path d="M7 14c0-3.3 2.7-6 6-6 2.3 0 4.4 1.3 5.4 3.4.3.5 0 1.1-.5 1.3-.5.2-1.1 0-1.3-.5-.7-1.4-2.1-2.2-3.6-2.2-2.2 0-4 1.8-4 4s1.8 4 4 4c1.6 0 3-1 3.7-2.4.2-.5.8-.7 1.3-.5.5.2.7.8.5 1.3-1.1 2.2-3.3 3.6-5.5 3.6-3.3 0-6-2.7-6-6z" />
          <text
            x="28"
            y="19"
            fontFamily="-apple-system, sans-serif"
            fontSize="17"
            fontWeight="800"
            letterSpacing="0.5"
          >
            nVIDIA.
          </text>
        </svg>
      ),
    },
    {
      name: "Supabase",
      svg: (
        <svg
          viewBox="0 0 135 28"
          fill="none"
          className="h-6 w-auto opacity-75 hover:opacity-100 transition-opacity"
          aria-label="Supabase logo"
        >
          <path
            d="M12.35 1.5c.67-.84 2-.37 2 .7v9.5h7.2c1.1 0 1.63 1.35.83 2.1l-10.4 12.7c-.67.84-2 .37-2-.7V16.3H2.78c-1.1 0-1.63-1.35-.83-2.1L12.35 1.5z"
            fill="currentColor"
          />
          <text
            x="28"
            y="20"
            fontFamily="-apple-system, sans-serif"
            fontSize="18"
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
      name: "OpenAI",
      svg: (
        <svg
          viewBox="0 0 115 28"
          fill="none"
          className="h-6 w-auto opacity-75 hover:opacity-100 transition-opacity"
          aria-label="OpenAI logo"
        >
          <g transform="translate(1, 2) scale(0.68)">
            <path
              d="M28.5 16.5A10.5 10.5 0 0 0 18 6.02v3.7a6.8 6.8 0 0 1 6.8 6.78h3.7zm-2.45-8.2a10.5 10.5 0 0 0-14.37-3.9l1.86 3.2a6.8 6.8 0 0 1 9.3 2.53l3.21-1.83zm-10.4-4.8A10.5 10.5 0 0 0 5.17 11.4l3.2 1.86a6.8 6.8 0 0 1 6.8-5.32V4.24zm-7.96 10.7a10.5 10.5 0 0 0 3.86 14.38l1.85-3.21a6.8 6.8 0 0 1-2.52-9.31l-3.2-1.86zm4.8 10.4a10.5 10.5 0 0 0 10.5 0v-3.7a6.8 6.8 0 0 1-6.8-1.46l-3.7 5.16zm12.84-.73a10.5 10.5 0 0 0 3.9-14.38l-3.2 1.86a6.8 6.8 0 0 1 2.52 9.31l-3.22 3.21z"
              fill="currentColor"
            />
          </g>
          <text
            x="26"
            y="20"
            fontFamily="-apple-system, sans-serif"
            fontSize="18"
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
      name: "TURSO",
      svg: (
        <svg
          viewBox="0 0 110 28"
          fill="none"
          className="h-6 w-auto opacity-75 hover:opacity-100 transition-opacity"
          aria-label="TURSO logo"
        >
          <g transform="translate(0, 3)">
            <path
              d="M3 4c1-2 4-2 6-1 2-1 5-1 6 1 1 2 0 5-1 7l-5 7-5-7C3 9 2 6 3 4z"
              stroke="currentColor"
              strokeWidth="1.8"
              fill="none"
            />
            <circle cx="6.5" cy="7.5" r="1" fill="currentColor" />
            <circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
          </g>
          <text
            x="24"
            y="19"
            fontFamily="-apple-system, sans-serif"
            fontSize="17"
            fontWeight="800"
            fill="currentColor"
            letterSpacing="1"
          >
            TURSO
          </text>
        </svg>
      ),
    },
    {
      name: "Gemini",
      svg: (
        <svg
          viewBox="0 0 115 28"
          fill="none"
          className="h-6 w-auto opacity-75 hover:opacity-100 transition-opacity"
          aria-label="Gemini logo"
        >
          <g transform="translate(2, 4)">
            <path
              d="M10 0C10 5.52 5.52 10 0 10c5.52 0 10 4.48 10 10 0-5.52 4.48-10 10-10-5.52 0-10-4.48-10-10z"
              fill="currentColor"
            />
          </g>
          <text
            x="26"
            y="19"
            fontFamily="-apple-system, sans-serif"
            fontSize="18"
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
      name: "Linear",
      svg: (
        <svg
          viewBox="0 0 105 28"
          fill="none"
          className="h-6 w-auto opacity-75 hover:opacity-100 transition-opacity"
          aria-label="Linear logo"
        >
          <g transform="translate(1, 4)">
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="currentColor"
              strokeWidth="2.2"
              fill="none"
            />
            <path
              d="M4.5 4.5l11 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
          <text
            x="25"
            y="19"
            fontFamily="-apple-system, sans-serif"
            fontSize="17"
            fontWeight="700"
            fill="currentColor"
            letterSpacing="-0.3"
          >
            Linear
          </text>
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full pt-20 sm:pt-28 pb-10">
      {/* Centered Heading exactly matching the reference */}
      <div className="text-center px-4 mb-10 sm:mb-12">
        <p className="text-base sm:text-xl font-normal text-muted-foreground/80 tracking-tight">
          Trusted by experts.
        </p>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground font-display mt-1">
          Used by the leaders.
        </h2>
      </div>

      {/* Edge-faded Infinite Marquee Slider */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] py-3">
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
