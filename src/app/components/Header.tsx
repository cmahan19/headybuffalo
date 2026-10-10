"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { site } from "@/lib/site";
import Drawer from "./ui/Drawer";

export interface NavLink {
  href: string;
  label: string;
}

const PhoneIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" />
  </svg>
);

/** `collections` comes from the server so only published, non-empty collections are linked. */
export default function Header({
  collections,
  hasProducts,
  showIdeas = false,
}: {
  collections: NavLink[];
  hasProducts: boolean;
  showIdeas?: boolean;
}) {
  const { cartCount, hydrated, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMenuOpen(false), [pathname]);

  // Desktop keeps a short menu (categories live on the shop page and in the footer); the mobile drawer lists all.
  const shopLink: NavLink[] = hasProducts ? [{ href: "/shop", label: "Shop all" }] : [];
  const secondary: NavLink[] = [
    ...(showIdeas ? [{ href: "/ideas", label: "Ideas" }] : []),
    { href: "/about", label: "About" },
    { href: "/contact", label: "Help" },
  ];
  const desktop: NavLink[] = [...shopLink, ...secondary];
  const primary: NavLink[] = [...shopLink, ...collections, ...secondary];
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const count = hydrated ? cartCount : 0;

  return (
    <header className="sticky top-0 z-50 bg-hb-ink text-white shadow-md">
      <div className="container-page flex h-16 items-center gap-2 sm:h-20">
        <button
          type="button"
          className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-md md:hidden"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <Link href="/" className="flex items-center gap-2 rounded-md" aria-label={`${site.name} home`}>
          <Image src="/logo.png" alt="" width={56} height={56} priority className="h-11 w-11 mix-blend-lighten sm:h-14 sm:w-14" />
          <span className="hidden whitespace-nowrap text-lg font-bold tracking-tight min-[420px]:inline sm:text-xl">{site.name}</span>
        </Link>

        <nav aria-label="Main" className="ml-6 hidden md:block lg:ml-10">
          <ul className="flex items-center gap-5 text-sm font-medium lg:gap-7">
            {desktop.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`inline-flex min-h-[44px] items-center transition hover:text-hb-sage ${
                    isActive(item.href) ? "text-hb-sage" : "text-white/85"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <a
            href={site.phone.href}
            className="mr-2 hidden items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold transition hover:border-hb-sage hover:text-hb-sage whitespace-nowrap lg:inline-flex"
          >
            <PhoneIcon size={16} />
            <span className="sr-only">Call us at </span>
            {site.phone.display}
          </a>
          <a
            href={site.phone.href}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:text-hb-sage lg:hidden"
            aria-label={`Call us at ${site.phone.display}`}
          >
            <PhoneIcon size={22} />
          </a>
          {hasProducts && (
            <Link
              href="/search"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:text-hb-sage"
              aria-label="Search products"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </Link>
          )}
          <button
            type="button"
            onClick={openCart}
            aria-haspopup="dialog"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-md hover:text-hb-sage"
            aria-label={count > 0 ? `Open cart, ${count} item${count === 1 ? "" : "s"}` : "Open cart"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 7h12l-1 13H7L6 7z" />
              <path d="M9 7a3 3 0 016 0" />
            </svg>
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 min-w-[20px] rounded-full bg-hb-sage px-1 text-center text-xs font-bold leading-5 text-hb-ink" aria-hidden="true">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
      <div aria-hidden="true" className="chrome-line h-px w-full" />

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu" side="left">
        <nav aria-label="Mobile">
          <ul className="divide-y divide-hb-ink/10">
            {primary.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-[52px] items-center text-base font-medium ${isActive(item.href) ? "text-hb-moss" : "text-hb-ink"}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a href={site.phone.href} className="btn-primary btn-lg mt-6 w-full">
          <PhoneIcon /> Call {site.phone.display}
        </a>
      </Drawer>
    </header>
  );
}
