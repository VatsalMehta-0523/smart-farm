-- ═══════════════════════════════════════════════════════════════════════════
-- Smart Farm Platform — Complete Database Schema
-- Run this entire file in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Enable required extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- ready for future fuzzy search


-- ══════════════════════════════════════════════════════════════════════════════
-- TABLES
-- ══════════════════════════════════════════════════════════════════════════════

-- ── plant_categories ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plant_categories (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  TEXT UNIQUE NOT NULL
);

COMMENT ON TABLE plant_categories IS 'Lookup table for plant categories (Medicinal, Herbs, etc.)';


-- ── plants ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id         UUID,                          -- reserved for future multi-farm
  slug            TEXT UNIQUE,                   -- display only — never used for routing
  name            TEXT NOT NULL,
  scientific_name TEXT,
  category_id     UUID REFERENCES plant_categories(id) ON DELETE SET NULL,
  short_desc      TEXT,
  medicinal_uses  TEXT,
  folklore        TEXT,
  genome_data     JSONB,                         -- flexible scientific metadata
  wikipedia_url   TEXT,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('published', 'draft', 'hidden')),
  qr_url          TEXT,                          -- Supabase Storage public URL
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE plants IS 'Core plant catalogue';
COMMENT ON COLUMN plants.slug IS 'Human-readable slug for display; routing always uses UUID';
COMMENT ON COLUMN plants.farm_id IS 'Reserved for multi-farm feature; leave NULL for now';
COMMENT ON COLUMN plants.genome_data IS 'JSONB bag: kingdom, family, chromosome_count, etc.';


-- ── plant_images ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plant_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id    UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,                     -- Supabase Storage public URL
  order_index INT  NOT NULL DEFAULT 0,           -- drag-to-reorder in admin
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE plant_images IS 'Images belonging to a plant, ordered by order_index';


-- ── plant_tags ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plant_tags (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  tag      TEXT NOT NULL
);

COMMENT ON TABLE plant_tags IS 'Free-form tags attached to a plant';


-- ── admins ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id    UUID,                               -- reserved for multi-farm
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE admins IS 'Maps Supabase Auth users to farm admin roles';


-- ══════════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_plants_status        ON plants(status);
CREATE INDEX IF NOT EXISTS idx_plants_category_id   ON plants(category_id);
CREATE INDEX IF NOT EXISTS idx_plants_created_at    ON plants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plant_images_plant   ON plant_images(plant_id, order_index);
CREATE INDEX IF NOT EXISTS idx_plant_tags_plant      ON plant_tags(plant_id);
-- trgm index for future fuzzy search
CREATE INDEX IF NOT EXISTS idx_plants_name_trgm     ON plants USING gin(name gin_trgm_ops);


-- ══════════════════════════════════════════════════════════════════════════════
-- UPDATED_AT TRIGGER
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS plants_updated_at ON plants;
CREATE TRIGGER plants_updated_at
  BEFORE UPDATE ON plants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on every table
ALTER TABLE plants           ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_tags       ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins           ENABLE ROW LEVEL SECURITY;


-- ── Helper: is current user an admin? ────────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  );
$$;


-- ── plants policies ───────────────────────────────────────────────────────────

-- Public: read published plants only
CREATE POLICY "public_read_published_plants"
  ON plants FOR SELECT
  USING (status = 'published');

-- Admin: read all plants
CREATE POLICY "admin_read_all_plants"
  ON plants FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: insert plants
CREATE POLICY "admin_insert_plants"
  ON plants FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin: update plants
CREATE POLICY "admin_update_plants"
  ON plants FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin: delete plants
CREATE POLICY "admin_delete_plants"
  ON plants FOR DELETE
  TO authenticated
  USING (is_admin());


-- ── plant_images policies ─────────────────────────────────────────────────────

CREATE POLICY "public_read_plant_images"
  ON plant_images FOR SELECT
  USING (true);

CREATE POLICY "admin_all_plant_images"
  ON plant_images FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ── plant_categories policies ─────────────────────────────────────────────────

CREATE POLICY "public_read_categories"
  ON plant_categories FOR SELECT
  USING (true);

CREATE POLICY "admin_all_categories"
  ON plant_categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ── plant_tags policies ───────────────────────────────────────────────────────

CREATE POLICY "public_read_tags"
  ON plant_tags FOR SELECT
  USING (true);

CREATE POLICY "admin_all_tags"
  ON plant_tags FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ── admins policies ───────────────────────────────────────────────────────────

-- Admins can only read/update their own row
CREATE POLICY "admin_own_row"
  ON admins FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());


-- ══════════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- Note: Run these OR create manually in Dashboard → Storage
-- ══════════════════════════════════════════════════════════════════════════════

-- Create the plant-images bucket (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'plant-images',
  'plant-images',
  true,
  10485760,    -- 10 MB per file
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;


-- Storage RLS: anyone can read
CREATE POLICY "public_read_plant_images_storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'plant-images');

-- Storage RLS: only authenticated admins can upload
CREATE POLICY "admin_upload_plant_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'plant-images'
    AND is_admin()
  );

-- Storage RLS: only authenticated admins can update
CREATE POLICY "admin_update_plant_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'plant-images'
    AND is_admin()
  );

-- Storage RLS: only authenticated admins can delete
CREATE POLICY "admin_delete_plant_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'plant-images'
    AND is_admin()
  );


-- ══════════════════════════════════════════════════════════════════════════════
-- SUCCESS
-- ══════════════════════════════════════════════════════════════════════════════
-- Schema created successfully.
-- Next step: run seeds.sql to populate default categories and your first admin.
