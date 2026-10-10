import Link from "next/link";
import { site } from "@/lib/site";

/** Layout for policy pages. When `paragraphs` is null, shows an honest interim notice instead of invented terms. */
export default function PolicyPage({
  title,
  paragraphs,
  interim,
  children,
}: {
  title: string;
  paragraphs?: string[] | null;
  interim?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="container-page max-w-3xl py-10 sm:py-14">
      <h1 className="text-display-sm sm:text-display-md">{title}</h1>
      <div className="prose-hb mt-6">
        {children ??
          (paragraphs && paragraphs.length > 0 ? (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <div className="panel">
              <p>{interim}</p>
              <p className="!mb-0">
                Call us at <a href={site.phone.href}>{site.phone.display}</a> or{" "}
                <Link href="/contact">send us a message</Link> and we’ll answer before you order.
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
