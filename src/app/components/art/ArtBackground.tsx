import Image from "next/image";
import { art } from "@/lib/art";

/** Full-bleed generated decorative art behind a section. Decorative only (alt=""). */
export default function ArtBackground({
  artId,
  priority = false,
  sizes = "100vw",
  className = "",
  position = "center",
}: {
  artId: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  position?: string;
}) {
  const a = art(artId);
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden="true" data-art={a.id}>
      <Image src={a.file} alt="" fill priority={priority} sizes={sizes} className="object-cover" style={{ objectPosition: position }} />
    </div>
  );
}
