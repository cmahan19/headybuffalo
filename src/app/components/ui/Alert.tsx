const tones = {
  info: { box: "bg-white ring-hb-ink/10 text-hb-ink", icon: "M12 8h.01M11 12h1v4h1" },
  success: { box: "bg-hb-sage/20 ring-hb-moss/20 text-hb-moss", icon: "M5 12l5 5L19 7" },
  error: { box: "bg-danger-light ring-danger/20 text-danger", icon: "M12 8v4m0 4h.01" },
} as const;

/** Status message with an icon and text, so meaning never relies on color alone. */
export default function Alert({
  tone = "info",
  title,
  children,
  className = "",
}: {
  tone?: keyof typeof tones;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex gap-3 rounded-card p-4 ring-1 ${t.box} ${className}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d={t.icon} />
      </svg>
      <div className="text-sm">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? "mt-1" : ""}>{children}</div>}
      </div>
    </div>
  );
}
