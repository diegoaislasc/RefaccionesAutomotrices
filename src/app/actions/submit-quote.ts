"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { notifyQuoteSubmitted } from "@/lib/notify-quote";
import {
  parseQuoteLineItems,
  validateCustomerQuoteFields,
} from "@/lib/quote-validation";

export type SubmitQuoteState =
  | { ok: true }
  | { ok: false; error: string };

function makeReferenceCode(): string {
  return `Q-${randomBytes(5).toString("hex").toUpperCase()}`;
}

export async function submitQuote(
  _prev: SubmitQuoteState | null,
  formData: FormData
): Promise<SubmitQuoteState> {
  const customer_name = String(formData.get("customer_name") ?? "");
  const customer_phone = String(formData.get("customer_phone") ?? "");
  const customer_emailRaw = String(formData.get("customer_email") ?? "");
  const notesRaw = String(formData.get("notes") ?? "");
  const itemsRaw = String(formData.get("items_json") ?? "");

  const fields = validateCustomerQuoteFields({
    customer_name,
    customer_phone,
    customer_email: customer_emailRaw.trim() || null,
    notes: notesRaw.trim() || null,
  });
  if (!fields.ok) {
    return { ok: false, error: fields.error };
  }

  const lines = parseQuoteLineItems(itemsRaw);
  if (!lines.ok) {
    return { ok: false, error: lines.error };
  }

  const supabase = await createClient();
  const ids = lines.items.map((i) => i.productId);
  const { data: products, error: pe } = await supabase
    .from("products")
    .select("id, name, slug, price, is_active")
    .in("id", ids);

  if (pe || !products?.length) {
    return {
      ok: false,
      error: "No se pudieron validar los productos. Intenta de nuevo.",
    };
  }

  if (products.length !== ids.length) {
    return {
      ok: false,
      error:
        "Algun producto ya no esta disponible. Actualiza tu cotizacion desde el catalogo.",
    };
  }

  const byId = new Map(products.map((p) => [p.id, p]));
  for (const line of lines.items) {
    const p = byId.get(line.productId);
    if (!p || p.is_active === false) {
      return {
        ok: false,
        error:
          "Un producto ya no esta disponible. Vuelve al catalogo y actualiza tu cotizacion.",
      };
    }
  }

  const MAX_ATTEMPTS = 8;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const reference_code = makeReferenceCode();
    const { data: quoteRow, error: qe } = await supabase
      .from("quotes")
      .insert({
        reference_code,
        customer_name: fields.customer_name,
        customer_phone: fields.customer_phone,
        customer_email: fields.customer_email,
        notes: fields.notes,
      })
      .select("id")
      .single();

    if (qe) {
      if (qe.code === "23505") continue;
      console.error("submitQuote insert quote:", qe);
      return {
        ok: false,
        error: "No se pudo crear la cotizacion. Intenta de nuevo.",
      };
    }

    const itemRows = lines.items.map((line) => {
      const p = byId.get(line.productId)!;
      return {
        quote_id: quoteRow.id,
        product_id: p.id,
        quantity: line.quantity,
        unit_price: p.price,
        product_name: p.name,
        product_slug: p.slug,
      };
    });

    const { error: ie } = await supabase.from("quote_items").insert(itemRows);
    if (ie) {
      console.error("submitQuote insert items:", ie);
      await supabase.from("quotes").delete().eq("id", quoteRow.id);
      return {
        ok: false,
        error: "No se pudieron guardar los productos. Intenta de nuevo.",
      };
    }

    const itemCount = itemRows.reduce((a, r) => a + r.quantity, 0);
    await notifyQuoteSubmitted({
      reference_code,
      customer_name: fields.customer_name,
      itemCount,
    });

    redirect(`/confirmacion?ref=${encodeURIComponent(reference_code)}`);
  }

  return {
    ok: false,
    error: "No se pudo generar un folio unico. Intenta de nuevo.",
  };
}
