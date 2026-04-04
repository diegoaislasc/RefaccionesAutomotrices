const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CustomerQuoteFields = {
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  notes: string | null;
};

export type ValidatedCustomerFields =
  | { ok: true } & CustomerQuoteFields
  | { ok: false; error: string };

export function validateCustomerQuoteFields(input: {
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  notes: string | null;
}): ValidatedCustomerFields {
  const customer_name = input.customer_name.trim();
  if (customer_name.length < 2) {
    return { ok: false, error: "Indica un nombre valido (minimo 2 caracteres)." };
  }
  if (customer_name.length > 200) {
    return { ok: false, error: "El nombre es demasiado largo." };
  }

  const digits = input.customer_phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return {
      ok: false,
      error: "Indica un telefono valido (al menos 10 digitos).",
    };
  }
  if (digits.length > 15) {
    return { ok: false, error: "El telefono es demasiado largo." };
  }

  let customer_email: string | null = null;
  if (input.customer_email && input.customer_email.trim()) {
    const e = input.customer_email.trim();
    if (!EMAIL_RE.test(e)) {
      return { ok: false, error: "El correo electronico no es valido." };
    }
    if (e.length > 320) {
      return { ok: false, error: "El correo es demasiado largo." };
    }
    customer_email = e;
  }

  let notes: string | null = null;
  if (input.notes && input.notes.trim()) {
    const n = input.notes.trim();
    if (n.length > 2000) {
      return { ok: false, error: "Las notas son demasiado largas." };
    }
    notes = n;
  }

  return {
    ok: true,
    customer_name,
    customer_phone: digits,
    customer_email,
    notes,
  };
}

export type QuoteLinePayload = { productId: string; quantity: number };

export type ParsedQuoteLines =
  | { ok: true; items: QuoteLinePayload[] }
  | { ok: false; error: string };

export function parseQuoteLineItems(json: string): ParsedQuoteLines {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { ok: false, error: "Datos de productos invalidos." };
  }
  if (!Array.isArray(raw) || raw.length === 0) {
    return { ok: false, error: "Agrega al menos un producto." };
  }
  const items: QuoteLinePayload[] = [];
  const seen = new Set<string>();
  for (const row of raw) {
    if (!row || typeof row !== "object") {
      return { ok: false, error: "Formato de lineas invalido." };
    }
    const r = row as Record<string, unknown>;
    const productId = typeof r.productId === "string" ? r.productId.trim() : "";
    const quantity =
      typeof r.quantity === "number" && Number.isFinite(r.quantity)
        ? Math.floor(r.quantity)
        : typeof r.quantity === "string"
          ? Math.floor(Number(r.quantity))
          : NaN;
    if (!productId || !/^[0-9a-f-]{36}$/i.test(productId)) {
      return { ok: false, error: "Identificador de producto invalido." };
    }
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 999) {
      return { ok: false, error: "Cantidad invalida (1–999)." };
    }
    if (seen.has(productId)) {
      return { ok: false, error: "Productos duplicados en la lista." };
    }
    seen.add(productId);
    items.push({ productId, quantity });
  }
  return { ok: true, items };
}
