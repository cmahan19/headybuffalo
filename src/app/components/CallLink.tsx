import { site } from "@/lib/site";

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" />
  </svg>
);

/** Click-to-call link for the customer phone line. */
export default function CallLink({
  className = "btn-secondary",
  label,
  icon = true,
}: {
  className?: string;
  label?: string;
  icon?: boolean;
}) {
  return (
    <a href={site.phone.href} className={className} aria-label={`Call ${site.name} at ${site.phone.display}`}>
      {icon && <PhoneIcon />}
      <span>{label ? `${label} ${site.phone.display}` : site.phone.display}</span>
    </a>
  );
}
