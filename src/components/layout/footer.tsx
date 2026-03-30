export function Footer() {
  return (
    <footer className="border-t bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Refacciones Automotrices. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a
              href="https://wa.me/521XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              WhatsApp
            </a>
            <span>|</span>
            <span>Tel: (XXX) XXX-XXXX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
