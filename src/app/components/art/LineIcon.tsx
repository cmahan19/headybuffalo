// Minimal line icons (inline SVG, inherits currentColor). Decorative unless given a label.
const paths: Record<string, React.ReactNode> = {
  home: <path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5" />,
  jar: (
    <>
      <path d="M8 3h8v3H8z" />
      <path d="M7 6h10a2 2 0 012 2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2z" />
      <path d="M9 12h6" />
    </>
  ),
  gift: (
    <>
      <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13" />
      <path d="M12 7c-2-3-5-3-5-1s3 1 5 1zM12 7c2-3 5-3 5-1s-3 1-5 1z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  sprout: <path d="M12 21v-9M12 12C12 7 8 5 4 5c0 4 3 7 8 7zM12 12c0-4 3-7 8-7 0 4-3 7-8 7z" />,
  tote: (
    <>
      <path d="M5 8h14l-1 13H6L5 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </>
  ),
  thread: (
    <>
      <path d="M7 3h10M7 21h10M8 3v18M16 3v18" />
      <path d="M8 7l8 3M8 11l8 3M8 15l8 3" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />,
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export default function LineIcon({
  name,
  size = 24,
  className = "",
  label,
}: {
  name: IconName;
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {paths[name]}
    </svg>
  );
}
