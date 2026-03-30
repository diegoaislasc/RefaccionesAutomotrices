import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">
            RA
          </div>
          <span className="hidden text-lg font-semibold tracking-tight sm:block">
            Refacciones
          </span>
        </Link>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar refacciones..."
            className="pl-9 h-9"
          />
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/buscar" className="text-muted-foreground hover:text-foreground transition-colors">
            Catalogo
          </Link>
          <Link href="/cotizacion" className="text-muted-foreground hover:text-foreground transition-colors">
            Cotizacion
          </Link>
        </nav>
      </div>
    </header>
  );
}
