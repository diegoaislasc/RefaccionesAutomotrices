import { describe, expect, it } from "vitest";
import {
  parseQuoteLineItems,
  validateCustomerQuoteFields,
} from "./quote-validation";

describe("validateCustomerQuoteFields", () => {
  it("rechaza nombre corto", () => {
    const r = validateCustomerQuoteFields({
      customer_name: "A",
      customer_phone: "5512345678",
      customer_email: null,
      notes: null,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/nombre/i);
  });

  it("acepta telefono con formato y normaliza digitos", () => {
    const r = validateCustomerQuoteFields({
      customer_name: "Juan Perez",
      customer_phone: "+52 55 1234-5678",
      customer_email: null,
      notes: null,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.customer_phone).toBe("525512345678");
  });

  it("valida email opcional", () => {
    const bad = validateCustomerQuoteFields({
      customer_name: "Juan",
      customer_phone: "5512345678",
      customer_email: "no-es-mail",
      notes: null,
    });
    expect(bad.ok).toBe(false);

    const good = validateCustomerQuoteFields({
      customer_name: "Juan",
      customer_phone: "5512345678",
      customer_email: "a@b.co",
      notes: null,
    });
    expect(good.ok).toBe(true);
    if (good.ok) expect(good.customer_email).toBe("a@b.co");
  });
});

describe("parseQuoteLineItems", () => {
  const id = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

  it("parsea array valido", () => {
    const r = parseQuoteLineItems(
      JSON.stringify([{ productId: id, quantity: 2 }])
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.items).toEqual([{ productId: id, quantity: 2 }]);
  });

  it("rechaza duplicados", () => {
    const r = parseQuoteLineItems(
      JSON.stringify([
        { productId: id, quantity: 1 },
        { productId: id, quantity: 2 },
      ])
    );
    expect(r.ok).toBe(false);
  });

  it("rechaza cantidad fuera de rango", () => {
    const r = parseQuoteLineItems(
      JSON.stringify([{ productId: id, quantity: 0 }])
    );
    expect(r.ok).toBe(false);
  });
});
