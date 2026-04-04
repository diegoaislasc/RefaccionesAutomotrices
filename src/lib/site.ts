/** Placeholder hasta configurar NEXT_PUBLIC_WHATSAPP_URL en Vercel. */
export const whatsAppHref =
  process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() ||
  "https://wa.me/521XXXXXXXXXX";

export function whatsAppMessageHref(text: string): string {
  const base = whatsAppHref.split("?")[0] || whatsAppHref;
  const params = new URLSearchParams({ text });
  return `${base}?${params.toString()}`;
}
