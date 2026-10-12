import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import JsonLd from "./components/JsonLd";
import { CartProvider } from "./context/CartContext";
import { publishedCategories, publishedProducts, showDrafts } from "@/lib/catalog";
import { showConceptShowcase } from "@/lib/flags";
import { absoluteUrl, site } from "@/lib/site";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: site.name,
    description: site.description,
    // Static share image (public/og-image.png), so every host can serve it without an edge runtime.
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }],
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description, images: ["/og-image.png"] },
  // Draft previews must never be indexed.
  robots: showDrafts ? { index: false, follow: false } : undefined,
  icons: { icon: "/favicon.ico", apple: "/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  width: "device-width",
  initialScale: 1,
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: absoluteUrl(site.logo),
  sameAs: site.social.map((s) => s.href),
  contactPoint: {
    "@type": "ContactPoint",
    telephone: site.phone.e164,
    ...(site.supportEmail && { email: site.supportEmail }),
    contactType: "customer service",
    areaServed: "US",
    availableLanguage: "English",
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${site.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const collections = publishedCategories().map((c) => ({ href: `/categories/${c.slug}`, label: c.name }));
  const hasProducts = publishedProducts().length > 0;

  return (
    <html lang="en" className={geistSans.variable}>
      <body className="flex min-h-screen flex-col bg-hb-bone text-hb-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-hb-ink focus:shadow"
        >
          Skip to content
        </a>
        <JsonLd data={[organizationLd, websiteLd]} />
        <CartProvider>
          {showDrafts && (
            <div className="bg-hb-sand px-4 py-2 text-center text-sm font-semibold text-hb-ink">
              Draft preview: unverified products are visible. Never enable SHOW_DRAFT_PRODUCTS in production.
            </div>
          )}
          <Header collections={collections} hasProducts={hasProducts} showIdeas={showConceptShowcase} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
