-- ============================================
-- MIGRATION: 003_quotes
-- Cotizaciones (sin auth publico)
-- ============================================

CREATE TYPE quote_status AS ENUM (
  'pending',
  'contacted',
  'confirmed',
  'cancelled'
);

CREATE TABLE quotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code  TEXT NOT NULL UNIQUE,
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  customer_email  TEXT,
  notes           TEXT,
  status          quote_status NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quote_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id      UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(id),
  quantity      INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price    NUMERIC(10, 2) NOT NULL,
  product_name  TEXT NOT NULL,
  product_slug  TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quotes_reference ON quotes(reference_code);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created ON quotes(created_at DESC);
CREATE INDEX idx_quote_items_quote ON quote_items(quote_id);

CREATE TRIGGER trg_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

-- Insercion publica (anon) desde Server Actions con anon key
CREATE POLICY "Anon puede crear cotizaciones"
  ON quotes
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon puede crear lineas de cotizacion"
  ON quote_items
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated puede crear cotizaciones"
  ON quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated puede crear lineas de cotizacion"
  ON quote_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Sin politicas SELECT para anon/authenticated: solo service_role lee (confirmacion server-side)
