import Link from "next/link";
import { HeaderQuoteLink } from "@/components/layout/header-quote-link";
import { SearchBar } from "@/components/search/search-bar";
import { whatsAppHref } from "@/lib/site";

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-zinc-200/60 bg-[#fbf8fc]/75 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-[#fbf8fc]/60 dark:border-zinc-800 dark:bg-zinc-950/70 dark:shadow-none">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 shrink-0 items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="truncate text-lg font-black tracking-tighter text-zinc-900 dark:text-zinc-50"
          >
            RA Refacciones
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              href="/buscar"
              className="border-b-2 border-[#b61722] pb-0.5 font-bold text-[#b61722]"
            >
              Catalogo
            </Link>
            <Link
              href="/cotizacion"
              className="text-zinc-600 transition-colors hover:text-[#b61722] dark:text-zinc-400 dark:hover:text-red-400"
            >
              Cotizacion
            </Link>
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 transition-colors hover:text-[#b61722] dark:text-zinc-400 dark:hover:text-red-400"
            >
              Contacto
            </a>
          </nav>
        </div>

        <div className="relative min-w-0 max-w-md flex-1">
          <SearchBar variant="compact" />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <HeaderQuoteLink
            variant="button"
            className="px-3 py-2 text-xs sm:px-5 sm:text-sm"
          />
        </div>
      </div>
    </header>
  );
}
