import Link from "next/link";
import { whatsAppHref } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-900 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 md:grid-cols-4">
        <div>
          <span className="mb-4 block text-lg font-bold text-zinc-50">
            RA Refacciones
          </span>
          <p className="text-sm text-zinc-400">
            Precisión técnica para motores y sistemas industriales de alto
            rendimiento.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-zinc-50">Empresa</h4>
          <span className="text-sm text-zinc-500">
            Refacciones automotrices y servicio pesado (MVP).
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-zinc-50">Enlaces</h4>
          <Link
            href="/buscar"
            className="text-sm text-zinc-500 transition-colors hover:text-red-400"
          >
            Catálogo
          </Link>
          <Link
            href="/cotizacion"
            className="text-sm text-zinc-500 transition-colors hover:text-red-400"
          >
            Solicitar cotización
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-zinc-50">Contacto</h4>
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 transition-colors hover:text-red-400"
          >
            WhatsApp
          </a>
          <p className="text-sm text-zinc-500">Tel: (por configurar)</p>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-screen-2xl flex-col items-start justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row sm:items-center">
        <p className="text-sm text-zinc-400">
          &copy; {year} Refacciones Automotrices. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
