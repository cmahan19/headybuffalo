import Link from "next/link";
import EmptyStateGlow from "./components/art/EmptyStateGlow";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="container-page py-10">
      <EmptyStateGlow
        headingLevel="h1"
        title="We couldn’t find that page"
        actions={
          <>
            <Link href="/" className="btn-primary">
              Go to the homepage
            </Link>
            <a href={site.phone.href} className="btn-secondary">
              Call {site.phone.display}
            </a>
          </>
        }
      >
        It may have moved. Head back home, or call us and we’ll point you in the right direction.
      </EmptyStateGlow>
    </div>
  );
}
