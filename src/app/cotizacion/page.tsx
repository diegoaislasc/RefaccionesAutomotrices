import { QuoteCartSection } from "@/components/quote/quote-cart-section";

export const metadata = {
  title: "Cotizacion | Refacciones",
};

export default function CotizacionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Tu cotizacion</h1>
      <p className="mt-2 text-muted-foreground">
        Revisa los productos, indica cantidades y envianos tus datos. Te
        contactaremos con precio final y disponibilidad.
      </p>
      <QuoteCartSection />
    </div>
  );
}
