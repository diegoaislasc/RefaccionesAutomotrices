-- ============================================
-- MIGRATION: 001_initial_schema
-- Refacciones Automotrices MVP
-- ============================================

CREATE EXTENSION IF NOT EXISTS unaccent;

-- CATEGORIES (hierarchical with parent_id)
CREATE TABLE categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url   TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- BRANDS
CREATE TABLE brands (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  logo_url    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_brands_slug ON brands(slug);

-- PRODUCTS
CREATE TABLE products (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name           TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description    TEXT,
  sku            TEXT UNIQUE,
  part_number    TEXT,
  price          NUMERIC(10,2) NOT NULL DEFAULT 0,
  compare_price  NUMERIC(10,2),
  category_id    UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand_id       UUID REFERENCES brands(id) ON DELETE SET NULL,
  images         TEXT[] DEFAULT '{}',
  specs          JSONB DEFAULT '{}',
  is_active      BOOLEAN DEFAULT true,
  stock          INT DEFAULT 0,
  search_vector  TSVECTOR,
  created_at     TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- VEHICLE COMPATIBILITIES (M:N)
CREATE TABLE vehicle_compatibilities (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  make        TEXT NOT NULL,
  model       TEXT NOT NULL,
  year_start  INT NOT NULL,
  year_end    INT,
  engine      TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_compat_product ON vehicle_compatibilities(product_id);
CREATE INDEX idx_compat_vehicle ON vehicle_compatibilities(make, model);

-- FULL-TEXT SEARCH TRIGGER
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', coalesce(unaccent(NEW.name), '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(unaccent(NEW.description), '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(NEW.sku, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(NEW.part_number, '')), 'A');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_search_vector
  BEFORE INSERT OR UPDATE OF name, description, sku, part_number
  ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_search_vector();

-- UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ROW LEVEL SECURITY
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_compatibilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public read brands" ON brands
  FOR SELECT USING (true);

CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read vehicle compatibilities" ON vehicle_compatibilities
  FOR SELECT USING (true);
