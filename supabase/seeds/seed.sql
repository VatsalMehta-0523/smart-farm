-- ═══════════════════════════════════════════════════════════════════════════
-- Smart Farm Platform — Seed Data
-- Run AFTER 001_schema.sql in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Default Plant Categories ──────────────────────────────────────────────────
INSERT INTO plant_categories (name) VALUES
  ('Medicinal'),
  ('Herbs'),
  ('Flowers'),
  ('Aromatic'),
  ('Seasonal'),
  ('Rare Plants')
ON CONFLICT (name) DO NOTHING;


-- ── Sample Plants (for development / demo) ────────────────────────────────────
-- These are demo entries. Delete them before going to production if you wish.

-- We need to capture the category UUIDs first
DO $$
DECLARE
  cat_medicinal  UUID;
  cat_herbs      UUID;
  cat_flowers    UUID;
  cat_aromatic   UUID;
  cat_rare       UUID;
  plant1_id      UUID;
  plant2_id      UUID;
  plant3_id      UUID;
BEGIN
  SELECT id INTO cat_medicinal FROM plant_categories WHERE name = 'Medicinal';
  SELECT id INTO cat_herbs     FROM plant_categories WHERE name = 'Herbs';
  SELECT id INTO cat_flowers   FROM plant_categories WHERE name = 'Flowers';
  SELECT id INTO cat_aromatic  FROM plant_categories WHERE name = 'Aromatic';
  SELECT id INTO cat_rare      FROM plant_categories WHERE name = 'Rare Plants';

  -- Plant 1: Tulsi
  INSERT INTO plants (
    id, slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    gen_random_uuid(),
    'tulsi-holy-basil',
    'Tulsi (Holy Basil)',
    'Ocimum tenuiflorum',
    cat_medicinal,
    'Tulsi is one of the most sacred plants in Hindu tradition and a powerful Ayurvedic herb known for its healing properties.',
    'Used to treat coughs, colds, fever, and stress. Contains eugenol, a natural anti-inflammatory. Rich in antioxidants and has antibacterial properties. Commonly made into herbal teas.',
    'Known as the "Queen of Herbs" in Ayurveda, Tulsi is worshipped as a goddess in Hindu households. It is believed to purify the air and protect the home from negative energy.',
    '{"kingdom": "Plantae", "family": "Lamiaceae", "genus": "Ocimum", "chromosome_count": "2n = 48", "origin": "Indian subcontinent"}',
    'https://en.wikipedia.org/wiki/Ocimum_tenuiflorum',
    'published'
  ) RETURNING id INTO plant1_id;

  INSERT INTO plant_tags (plant_id, tag) VALUES
    (plant1_id, 'Ayurvedic'),
    (plant1_id, 'Sacred'),
    (plant1_id, 'Anti-inflammatory');

  -- Plant 2: Neem
  INSERT INTO plants (
    id, slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    gen_random_uuid(),
    'neem-miracle-tree',
    'Neem',
    'Azadirachta indica',
    cat_medicinal,
    'Often called the "Village Pharmacy", Neem is one of the most versatile medicinal trees with over 130 biologically active compounds.',
    'Antifungal, antibacterial, antiviral. Used for skin diseases, diabetes management, dental care, and pest control. Neem oil is used in organic farming as a natural pesticide.',
    'Ancient Indian texts call Neem "Sarva Roga Nivarini" — the curer of all ailments. Farmers in India have used neem-based preparations for centuries to protect crops.',
    '{"kingdom": "Plantae", "family": "Meliaceae", "genus": "Azadirachta", "origin": "South Asia", "lifespan": "Perennial, 150-200 years"}',
    'https://en.wikipedia.org/wiki/Azadirachta_indica',
    'published'
  ) RETURNING id INTO plant2_id;

  INSERT INTO plant_tags (plant_id, tag) VALUES
    (plant2_id, 'Antibacterial'),
    (plant2_id, 'Antifungal'),
    (plant2_id, 'Organic Farming');

  -- Plant 3: Aloe Vera
  INSERT INTO plants (
    id, slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    gen_random_uuid(),
    'aloe-vera',
    'Aloe Vera',
    'Aloe barbadensis miller',
    cat_herbs,
    'A succulent plant species with thick, fleshy leaves filled with a soothing gel used in traditional medicine and modern skincare worldwide.',
    'Treats burns, wounds, and skin irritation. The gel reduces inflammation and accelerates healing. Used for digestive health, and contains vitamins A, C, E, and B12.',
    'Ancient Egyptians called it the "Plant of Immortality" and used it in burial rituals. Cleopatra reportedly used aloe vera gel as part of her beauty regimen.',
    '{"kingdom": "Plantae", "family": "Asphodelaceae", "genus": "Aloe", "origin": "Arabian Peninsula", "type": "Succulent"}',
    'https://en.wikipedia.org/wiki/Aloe_vera',
    'published'
  ) RETURNING id INTO plant3_id;

  INSERT INTO plant_tags (plant_id, tag) VALUES
    (plant3_id, 'Skincare'),
    (plant3_id, 'Succulent'),
    (plant3_id, 'Wound Healing');

END $$;


-- ═══════════════════════════════════════════════════════════════════════════
-- HOW TO CREATE YOUR ADMIN USER
-- ═══════════════════════════════════════════════════════════════════════════
--
-- STEP 1: Create auth user via Supabase Dashboard
--   Go to: Authentication → Users → Add user
--   Fill in: Email + Password
--   Click "Create user"
--   Copy the UUID shown (e.g. "a1b2c3d4-...")
--
-- STEP 2: Run this query (replace with your actual UUID from Step 1):
--
--   INSERT INTO admins (id) VALUES ('PASTE-YOUR-UUID-HERE');
--
-- That's it. The user can now log in at /admin/login
-- ═══════════════════════════════════════════════════════════════════════════
