import Image from "next/image";

/**
 * Branded graphic treatment built only from approved brand assets (the logo and palette).
 * Used wherever a real, authorized photo doesn't exist yet: hero, collection tiles, about page.
 * It depicts no product, person, or place, so it can't misrepresent anything.
 */
export default function BrandGraphic({
  className = "",
  showLogo = true,
  logoSize = 320,
  priority = false,
  tone = "ember",
}: {
  className?: string;
  showLogo?: boolean;
  logoSize?: number;
  priority?: boolean;
  tone?: "ember" | "forest" | "sky";
}) {
  const glow = {
    ember: "from-ember/35",
    forest: "from-forest/60",
    sky: "from-sky-brand/45",
  }[tone];

  return (
    <div className={`relative isolate overflow-hidden bg-hb-ink ${className}`} aria-hidden="true">
      <div className={`absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_40%,var(--tw-gradient-from),transparent_60%)] ${glow}`} />
      {/* Triangle line-work echoing the logo's geometry. */}
      <svg className="absolute inset-0 -z-10 h-full w-full opacity-[0.18]" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="#f6a24f" strokeWidth="0.8">
          <path d="M200 30 L370 330 L30 330 Z" />
          <path d="M200 90 L318 300 L82 300 Z" />
          <circle cx="200" cy="230" r="100" />
          <circle cx="200" cy="30" r="8" />
          <circle cx="370" cy="330" r="8" />
          <circle cx="30" cy="330" r="8" />
        </g>
      </svg>
      {showLogo && (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <Image
            src="/logo.png"
            alt=""
            width={logoSize}
            height={logoSize}
            priority={priority}
            sizes={`${logoSize}px`}
            className="h-auto w-[70%] mix-blend-lighten"
            style={{ maxWidth: logoSize }}
          />
        </div>
      )}
    </div>
  );
}
