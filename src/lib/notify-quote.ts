/**
 * Notificacion opcional al recibir una cotizacion (Resend).
 * Sin RESEND_API_KEY o QUOTE_NOTIFY_EMAIL no hace nada.
 */
export async function notifyQuoteSubmitted(payload: {
  reference_code: string;
  customer_name: string;
  itemCount: number;
}) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_NOTIFY_EMAIL;
  if (!key || !to) return;

  const from = process.env.RESEND_FROM ?? "Refacciones <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Nueva cotizacion ${payload.reference_code}`,
        text: `Cliente: ${payload.customer_name}\nPiezas (suma cantidades): ${payload.itemCount}\nFolio: ${payload.reference_code}`,
      }),
    });
    if (!res.ok) {
      console.error("notifyQuoteSubmitted: Resend HTTP", res.status);
    }
  } catch (e) {
    console.error("notifyQuoteSubmitted:", e);
  }
}
