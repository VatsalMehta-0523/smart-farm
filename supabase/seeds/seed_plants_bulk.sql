-- ═══════════════════════════════════════════════════════════════════════════
-- Smart Farm — Bulk Plant Seed Data (35 Plants)
-- Paste this ENTIRE script into Supabase SQL Editor and click "Run"
-- All plants are inserted as DRAFT — admin reviews and publishes them
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  cat_medicinal  UUID;
  cat_herbs      UUID;
  cat_flowers    UUID;
  cat_aromatic   UUID;
  cat_seasonal   UUID;
  cat_rare       UUID;
  pid            UUID;  -- reusable plant id variable
BEGIN
  -- ── Look up category UUIDs ───────────────────────────────────────────────
  SELECT id INTO cat_medicinal FROM plant_categories WHERE name = 'Medicinal';
  SELECT id INTO cat_herbs     FROM plant_categories WHERE name = 'Herbs';
  SELECT id INTO cat_flowers   FROM plant_categories WHERE name = 'Flowers';
  SELECT id INTO cat_aromatic  FROM plant_categories WHERE name = 'Aromatic';
  SELECT id INTO cat_seasonal  FROM plant_categories WHERE name = 'Seasonal';
  SELECT id INTO cat_rare      FROM plant_categories WHERE name = 'Rare Plants';


  -- ═══════════════════════════════════════════════════════════════════════════
  -- FLOWERS
  -- ═══════════════════════════════════════════════════════════════════════════

  -- ── 1. Gulab (Rose) ──────────────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'gulab-rose',
    'Gulab (Rose)',
    'Rosa spp.',
    cat_flowers,
    'A woody perennial flowering shrub renowned globally for its beautiful, fragrant flowers and thorny stems.',
    'Rosewater is used for skin hydration and cooling; rosehips are rich in Vitamin C and boost immunity.',
    'Long celebrated as the universal symbol of love, beauty, and romance across countless ancient cultures.',
    '{"kingdom": "Plantae", "family": "Rosaceae", "genus": "Rosa", "origin": "Asia (predominantly), with some species native to Europe and North America"}',
    'https://en.wikipedia.org/wiki/Rose',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Ornamental'), (pid, 'Fragrant'), (pid, 'Essential Oil');


  -- ── 2. Akelifa (Copperleaf) ──────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'akelifa-copperleaf',
    'Akelifa (Copperleaf)',
    'Acalypha wilkesiana',
    cat_flowers,
    'An evergreen tropical shrub cherished for its striking, multicolored coppery-green and red leaves.',
    'Leaves have traditional antimicrobial properties used to treat superficial fungal skin infections.',
    'Cultivated widely as a vibrant protective hedge plant in tropical estates and gardens.',
    '{"kingdom": "Plantae", "family": "Euphorbiaceae", "genus": "Acalypha", "origin": "Bismarck Archipelago, Papua New Guinea"}',
    'https://en.wikipedia.org/wiki/Acalypha_wilkesiana',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Foliage'), (pid, 'Border Plant'), (pid, 'Ornamental');


  -- ── 3. Mogro (Arabian Jasmine) ───────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'mogro-arabian-jasmine',
    'Mogro (Arabian Jasmine)',
    'Jasminum sambac',
    cat_flowers,
    'A small evergreen shrub or vine with intensely fragrant, pure white flowers that open late in the evening.',
    'Used in aromatherapy to alleviate stress; flower extracts help soothe minor skin irritations.',
    'Intimately tied to Indian rituals, weddings, and hair adornments, symbolizing purity and divine devotion.',
    '{"kingdom": "Plantae", "family": "Oleaceae", "genus": "Jasminum", "origin": "South and Southeast Asia"}',
    'https://en.wikipedia.org/wiki/Jasminum_sambac',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Fragrant'), (pid, 'Devotional'), (pid, 'Essential Oil');


  -- ── 30. Garmalo (Golden Shower Tree) ─────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'garmalo-golden-shower-tree',
    'Garmalo (Golden Shower Tree)',
    'Cassia fistula',
    cat_flowers,
    'A spectacular deciduous tree that bursts into a cascade of bright golden-yellow pendulous flower clusters during late spring.',
    'Fruit pulp serves as a safe traditional laxative; leaves are used to treat skin eruptions.',
    'The state flower of Kerala (called Kanikkonna), it is an essential symbol of prosperity during the Vishu festival.',
    '{"kingdom": "Plantae", "family": "Fabaceae", "genus": "Cassia", "origin": "Indian subcontinent and neighboring regions of Southeast Asia"}',
    'https://en.wikipedia.org/wiki/Cassia_fistula',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Ornamental'), (pid, 'Yellow Blooms'), (pid, 'Ayurvedic');


  -- ── 31. Gulmahor (Royal Poinciana) ───────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'gulmahor-royal-poinciana',
    'Gulmahor (Royal Poinciana)',
    'Delonix regia',
    cat_flowers,
    'A fast-growing tree with large, spreading umbrella canopies that turn into a sea of brilliant fiery red-orange blossoms in summer.',
    'Possesses minor antioxidant and anti-inflammatory properties; bark extracts are traditionally used in folk remedies.',
    'Celebrated heavily in Indian poetry and romantic literature for painting summer avenues in rich flame colors.',
    '{"kingdom": "Plantae", "family": "Fabaceae", "genus": "Delonix", "origin": "Madagascar"}',
    'https://en.wikipedia.org/wiki/Delonix_regia',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Avenue Tree'), (pid, 'Flame Blooms'), (pid, 'Shade Tree');


  -- ═══════════════════════════════════════════════════════════════════════════
  -- AROMATIC
  -- ═══════════════════════════════════════════════════════════════════════════

  -- ── 4. Champo (Frangipani) ───────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'champo-frangipani',
    'Champo (Frangipani)',
    'Plumeria rubra',
    cat_aromatic,
    'A small tropical tree with thick succulent branches and highly fragrant, pinwheel-shaped white or pink blossoms.',
    'Milky sap is used carefully in folk medicine for minor skin ailments; bark has rubefacient properties.',
    'Known widely as the "Temple Tree," it is heavily planted near shrines and associated with immortality due to its ability to bloom even when uprooted.',
    '{"kingdom": "Plantae", "family": "Apocynaceae", "genus": "Plumeria", "origin": "Central America, Mexico, and the Caribbean"}',
    'https://en.wikipedia.org/wiki/Plumeria_rubra',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Temple Tree'), (pid, 'Fragrant'), (pid, 'Exotic');


  -- ── 16. Safed Chandan (White Sandalwood) ─────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'safed-chandan-white-sandalwood',
    'Safed Chandan (White Sandalwood)',
    'Santalum album',
    cat_aromatic,
    'A highly prized, slow-growing hemiparasitic tree famed for its ultra-fragrant heartwood and valuable essential oil.',
    'Highly cooling paste used for acne, skin inflammation, sunburns, and reducing body heat.',
    'Sacred in Hinduism and Buddhism; the wood paste is essential for daily deity worship and marking the forehead.',
    '{"kingdom": "Plantae", "family": "Santalaceae", "genus": "Santalum", "origin": "Southern India and Southeast Asia"}',
    'https://en.wikipedia.org/wiki/Santalum_album',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Sacred'), (pid, 'High Value'), (pid, 'Essential Oil');


  -- ═══════════════════════════════════════════════════════════════════════════
  -- HERBS & DAILY USE
  -- ═══════════════════════════════════════════════════════════════════════════

  -- ── 5. Limbuu (Lemon) ────────────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'limbuu-lemon',
    'Limbuu (Lemon)',
    'Citrus limon',
    cat_herbs,
    'A small, thorny evergreen tree producing oval yellow citrus fruits prized for their sharp, acidic juice.',
    'Packed with Vitamin C to support immunity, aid digestion, and detoxify the body.',
    'Used heavily in Indian households to ward off the "evil eye" (nimbu-mirchi) and bring positive energy.',
    '{"kingdom": "Plantae", "family": "Rutaceae", "genus": "Citrus", "origin": "South Asia (primarily Northeast India)"}',
    'https://en.wikipedia.org/wiki/Lemon',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Citrus'), (pid, 'Vitamin C'), (pid, 'Culinary');


  -- ── 13. Gundo (Lasora) ──────────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'gundo-lasora',
    'Gundo (Lasora)',
    'Cordia myxa',
    cat_herbs,
    'A medium-sized tree producing sticky, mucilaginous green fruits widely used across Gujarat for culinary preparations.',
    'The sticky fruit pulp acts as a natural demulcent to soothe sore throats, coughs, and digestive tracts.',
    'A summer staple in Gujarati culture, famous for the traditional Gunda Pickle seasoned with mustard seeds.',
    '{"kingdom": "Plantae", "family": "Boraginaceae", "genus": "Cordia", "origin": "Indomalaya region and Northern Africa"}',
    'https://en.wikipedia.org/wiki/Cordia_myxa',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Pickle'), (pid, 'Sticky Fruit'), (pid, 'Gujarati Cuisine');


  -- ── 25. Badam (Indian Almond) ────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'badam-indian-almond',
    'Badam (Indian Almond)',
    'Terminalia catappa',
    cat_herbs,
    'A large tropical tree featuring distinct tiered horizontal branches and large obovate leaves that turn vibrant red before shedding.',
    'Tannin-rich leaves are used to treat skin conditions and are widely utilized in aquariums to naturalize water for fish.',
    'Grown heavily across Indian streets and school yards to serve as an instant, broad-leaved shade provider against harsh summers.',
    '{"kingdom": "Plantae", "family": "Combretaceae", "genus": "Terminalia", "origin": "Tropical regions of Asia, Australia, and Madagascar"}',
    'https://en.wikipedia.org/wiki/Terminalia_catappa',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Shade Tree'), (pid, 'Coastal'), (pid, 'Nut-Bearing');


  -- ═══════════════════════════════════════════════════════════════════════════
  -- SEASONAL FRUITS
  -- ═══════════════════════════════════════════════════════════════════════════

  -- ── 6. Paras Jambu (Wax Apple) ───────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'paras-jambu-wax-apple',
    'Paras Jambu (Wax Apple)',
    'Syzygium samarangense',
    cat_seasonal,
    'A tropical tree bearing bell-shaped, crisp, and exceptionally juicy pinkish-red fruits with a spongy core.',
    'Low calorie and highly hydrating; traditional flowers are used to help lower fevers.',
    'Enjoyed as a refreshing, water-rich treat during hot tropical summers across Asian home gardens.',
    '{"kingdom": "Plantae", "family": "Myrtaceae", "genus": "Syzygium", "origin": "Greater Sunda Islands, Malay Peninsula, and Andaman & Nicobar"}',
    'https://en.wikipedia.org/wiki/Syzygium_samarangense',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Hydrating'), (pid, 'Fruit Tree'), (pid, 'Summer Crop');


  -- ── 7. Sada Jambu (Java Plum / Black Plum) ──────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'sada-jambu-black-plum',
    'Sada Jambu (Black Plum)',
    'Syzygium cumini',
    cat_seasonal,
    'A fast-growing tree producing oblong, deep purple fruits that leave a distinctive dark stain on the tongue when eaten.',
    'Seeds are famously pulverized in Ayurveda to regulate blood sugar and manage diabetes symptoms.',
    'Revered in Indian mythology as the fruit of the gods; Lord Rama is said to have survived on these during exile.',
    '{"kingdom": "Plantae", "family": "Myrtaceae", "genus": "Syzygium", "origin": "Indian subcontinent and Southeast Asia"}',
    'https://en.wikipedia.org/wiki/Syzygium_cumini',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Anti-Diabetic'), (pid, 'Purple Staining'), (pid, 'Ancient');


  -- ── 8. Safed Jambu (White Wax Apple) ─────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'safed-jambu-white-wax-apple',
    'Safed Jambu (White Java Apple)',
    'Syzygium samarangense var. alba',
    cat_seasonal,
    'A distinct variety of the bell-shaped wax apple that matures into a translucent, pale milky-white color with a mild sweet taste.',
    'High water content aids in combating dehydration and supports overall digestive cooling.',
    'Often prized as a rare backyard novelty fruit tree compared to its standard dark purple relatives.',
    '{"kingdom": "Plantae", "family": "Myrtaceae", "genus": "Syzygium", "origin": "Southeast Asia (Cultivar variant)"}',
    'https://en.wikipedia.org/wiki/Syzygium_samarangense',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Rare Fruit'), (pid, 'White Variant'), (pid, 'Crisp');


  -- ── 10. Nana Shetur (White Mulberry) ─────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'nana-shetur-white-mulberry',
    'Nana Shetur (White Mulberry)',
    'Morus alba',
    cat_seasonal,
    'A small-to-medium deciduous tree with highly variable leaves, bearing sweet, pale, cylindrical aggregate fruits.',
    'Leaves contain compounds that inhibit high blood sugar absorption; bark acts as a mild expectorant.',
    'Historically critical as the primary, exclusive food source for silkworms in the ancient global silk trade.',
    '{"kingdom": "Plantae", "family": "Moraceae", "genus": "Morus", "origin": "Central and Northern China"}',
    'https://en.wikipedia.org/wiki/Morus_alba',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Silk Production'), (pid, 'Sweet Berries'), (pid, 'Foraging');


  -- ── 11. Mota Shetur (Black Mulberry) ─────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'mota-shetur-black-mulberry',
    'Mota Shetur (Black Mulberry)',
    'Morus nigra',
    cat_seasonal,
    'A robust, long-lived tree with rough leaves, bearing dark purple-to-black berries that boast a rich, sweet-tart flavor profile.',
    'Rich in dark anthocyanin antioxidants; juices are used to soothe sore throats and mouth ulcers.',
    'Celebrated in European and West Asian gardens since antiquity for producing superior, gourmet dessert berries.',
    '{"kingdom": "Plantae", "family": "Moraceae", "genus": "Morus", "origin": "Southwestern Asia (specifically southwestern Iran)"}',
    'https://en.wikipedia.org/wiki/Morus_nigra',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Antioxidant'), (pid, 'Tart Berry'), (pid, 'Hardy');


  -- ── 14. Sitafali (Custard Apple) ─────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'sitafali-custard-apple',
    'Sitafali (Custard Apple)',
    'Annona squamosa',
    cat_seasonal,
    'A small tree producing knobby, scale-like green fruits filled with an incredibly sweet, creamy, custard-like white pulp.',
    'Crushed leaves serve as a potent traditional remedy to destroy lice and heal infected skin wounds.',
    'Named culturally after Goddess Sita, symbolizing sweetness, purity, and abundant autumn harvests.',
    '{"kingdom": "Plantae", "family": "Annonaceae", "genus": "Annona", "origin": "Tropical Americas and the West Indies"}',
    'https://en.wikipedia.org/wiki/Annona_squamosa',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Creamy Fruit'), (pid, 'Autumn Harvest'), (pid, 'Insecticidal Leaves');


  -- ── 20. Ramfal (Bullock''s Heart) ────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'ramfal-bullocks-heart',
    'Ramfal (Bullock''s Heart)',
    'Annona reticulata',
    cat_seasonal,
    'A close relative of the sitafal, this tree yields larger, heart-shaped, smooth reddish-yellow fruits with a dense, meaty pulp.',
    'Leaf decoctions are traditionally used as a mild vermifuge to eliminate internal parasites; bark acts as an astringent.',
    'Named after Lord Rama, it complements the Sitafal and ripens uniquely during the early spring months.',
    '{"kingdom": "Plantae", "family": "Annonaceae", "genus": "Annona", "origin": "Tropical Americas"}',
    'https://en.wikipedia.org/wiki/Annona_reticulata',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Heart-Shaped'), (pid, 'Spring Fruit'), (pid, 'Creamy');


  -- ── 24. Ambala (Star Gooseberry) ─────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'ambala-star-gooseberry',
    'Ambala (Star Gooseberry)',
    'Phyllanthus acidus',
    cat_seasonal,
    'A small tree bearing dense, pendulous clusters of small, obovate, pale-yellow fruits with deeply ribbed star-like patterns.',
    'The intensely sour fruit is packed with Vitamin C and acts as an effective digestive appetite stimulant.',
    'Eaten fresh with salt and chili powder by schoolchildren, or used as a sharp souring agent in country relishes.',
    '{"kingdom": "Plantae", "family": "Phyllanthaceae", "genus": "Phyllanthus", "origin": "Coastal Northeastern Brazil, naturalized widely in South Asia"}',
    'https://en.wikipedia.org/wiki/Phyllanthus_acidus',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Acidic'), (pid, 'Star-Shaped'), (pid, 'Backyard Fruit');


  -- ── 29. Saru (Casuarina / Whistling Pine) ───────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'saru-whistling-pine',
    'Saru (Whistling Pine)',
    'Casuarina equisetifolia',
    cat_seasonal,
    'A tall, slender tree resembling a conifer, featuring fine, jointed, needle-like green branchlets that sigh softly in the wind.',
    'Bark decoctions are utilized in traditional medicine to soothe chronic diarrhea and internal cramps.',
    'Extensively planted across Indian coastlines and farm boundaries to act as an unyielding windbreak and soil stabilizer.',
    '{"kingdom": "Plantae", "family": "Casuarinaceae", "genus": "Casuarina", "origin": "Southeast Asia, Northern Australia, and Pacific Islands"}',
    'https://en.wikipedia.org/wiki/Casuarina_equisetifolia',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Windbreak'), (pid, 'Agroforestry'), (pid, 'Slender');


  -- ═══════════════════════════════════════════════════════════════════════════
  -- MEDICINAL
  -- ═══════════════════════════════════════════════════════════════════════════

  -- ── 9. Anjeer (Common Fig) ───────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'anjeer-common-fig',
    'Anjeer (Common Fig)',
    'Ficus carica',
    cat_medicinal,
    'A small deciduous tree famous for producing sweet, pear-shaped hollow fruits lined internally with hundreds of tiny flowers.',
    'Highly valued as an iron-rich dietary fiber source that naturally relieves chronic constipation.',
    'One of the oldest cultivated plants in human history, explicitly revered across numerous ancient Mediterranean scriptures.',
    '{"kingdom": "Plantae", "family": "Moraceae", "genus": "Ficus", "origin": "Southwest Asia and the Mediterranean basin"}',
    'https://en.wikipedia.org/wiki/Common_fig',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Ancient Crop'), (pid, 'High Fiber'), (pid, 'Laxative');


  -- ── 12. Dadmi (Pomegranate) ──────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'dadmi-pomegranate',
    'Dadmi (Pomegranate)',
    'Punica granatum',
    cat_medicinal,
    'A multi-stemmed deciduous shrub yielding leathery red fruits packed with hundreds of juicy, ruby-red seed arils.',
    'High in polyphenols to support heart health; the dry rind is an ancient, potent cure for dysentery.',
    'Celebrated cross-culturally as the ultimate symbol of fertility, prosperity, and eternal life.',
    '{"kingdom": "Plantae", "family": "Lythraceae", "genus": "Punica", "origin": "Region extending from Iran to Northern India"}',
    'https://en.wikipedia.org/wiki/Pomegranate',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Superfood'), (pid, 'Crimson Seeds'), (pid, 'Antioxidant');


  -- ── 15. Umro (Cluster Fig) ───────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'umro-cluster-fig',
    'Umro (Cluster Fig)',
    'Ficus racemosa',
    cat_medicinal,
    'A large, canopy-forming fig tree whose fruits grow in dense, clustered masses directly out of the main trunk and large branches.',
    'The milky latex is applied to reduce painful boils; raw fruits assist in settling irritated digestive tracts.',
    'Sacred tree in Hinduism associated with the planet Venus and the fierce deity Lord Narasimha.',
    '{"kingdom": "Plantae", "family": "Moraceae", "genus": "Ficus", "origin": "Australia, Malesia, Indo-China, and the Indian subcontinent"}',
    'https://en.wikipedia.org/wiki/Ficus_racemosa',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Sacred'), (pid, 'Cauliflory'), (pid, 'Wildlife Support');


  -- ── 21. Karanj (Indian Beech) ────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'karanj-indian-beech',
    'Karanj (Indian Beech)',
    'Millettia pinnata',
    cat_medicinal,
    'A hardy, medium-sized tree with glossy green leaves and pale pinkish flower clusters, adaptable to poor soils.',
    'Seed oil is heavily extracted to treat chronic eczema, psoriasis, and is actively researched as a renewable biodiesel source.',
    'Traditionally valued by farmers as a premium green manure source and for providing natural, nitrogen-fixing soil enrichment.',
    '{"kingdom": "Plantae", "family": "Fabaceae", "genus": "Millettia", "origin": "Tropical and temperate Asia, and Northern Australia"}',
    'https://en.wikipedia.org/wiki/Millettia_pinnata',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Biodiesel'), (pid, 'Nitrogen-Fixing'), (pid, 'Skin Care');


  -- ── 22. Mahudo (Mahua) ───────────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'mahudo-mahua',
    'Mahudo (Mahua)',
    'Madhuca longifolia',
    cat_medicinal,
    'A massive, slow-growing tropical tree prized for its fleshy, sweet, cream-colored flowers that drop to the ground at dawn.',
    'Flowers treat respiratory ailments and boost vitality; seed fat (Mahua butter) relieves painful joint rheumatism.',
    'The absolute lifeline tree for indigenous tribal communities in India, providing food, medicine, and traditional celebratory spirits.',
    '{"kingdom": "Plantae", "family": "Sapotaceae", "genus": "Madhuca", "origin": "Central and North India, and surrounding plains"}',
    'https://en.wikipedia.org/wiki/Madhuca_longifolia',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Tribal Lifeline'), (pid, 'Edible Flowers'), (pid, 'Seed Butter');


  -- ── 23. Aritha (Soapnut Tree) ────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'aritha-soapnut-tree',
    'Aritha (Soapnut Tree)',
    'Sapindus trifoliatus',
    cat_medicinal,
    'A medium-sized tree yielding golden-brown, wrinkled leathery saponin-rich berries that foam naturally when mixed with water.',
    'Acts as an eco-friendly, chemical-free shampoo that cleanses hair, treats dandruff, and relieves scalp itchiness.',
    'The quintessential natural cleaning agent across ancient India for washing delicate silks and polishing fine gold jewelry.',
    '{"kingdom": "Plantae", "family": "Sapindaceae", "genus": "Sapindus", "origin": "Southern India and coastal plains"}',
    'https://en.wikipedia.org/wiki/Sapindus',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Natural Saponin'), (pid, 'Hair Care'), (pid, 'Eco-Friendly');


  -- ── 26. Khati Ambli (Sour Tamarind) ──────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'khati-ambli-sour-tamarind',
    'Khati Ambli (Sour Tamarind)',
    'Tamarindus indica',
    cat_medicinal,
    'A massive, long-lived evergreen shade tree bearing curved brown pods filled with an intensely sour, sticky fruit pulp.',
    'Ripe pulp treats vitamin deficiencies, serves as a digestive stimulant, and aids as a mild natural laxative.',
    'A cornerstone of Indian gastronomy, its tangy pulp forms the essential base for regional curries, chutneys, and lentil broths.',
    '{"kingdom": "Plantae", "family": "Fabaceae", "genus": "Tamarindus", "origin": "Tropical Africa, naturalized in India for thousands of years"}',
    'https://en.wikipedia.org/wiki/Tamarind',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Culinary Base'), (pid, 'Tangy Pods'), (pid, 'Massive Canopy');


  -- ── 27. Mithi Ambli (Sweet Tamarind) ─────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'mithi-ambli-sweet-tamarind',
    'Mithi Ambli (Sweet Tamarind)',
    'Tamarindus indica (Sweet Cultivar)',
    cat_medicinal,
    'A specialized horticultural variant of the standard tamarind tree whose pods carry a distinctly low-acid, sweet flavor profile.',
    'High in natural protective antioxidants and serves as an instant, easily digestible source of fruit energy.',
    'Highly sought after as a premium fresh table fruit dessert compared to its sour counterpart.',
    '{"kingdom": "Plantae", "family": "Fabaceae", "genus": "Tamarindus", "origin": "Developed via selection in Thailand and Southeast Asia"}',
    'https://en.wikipedia.org/wiki/Tamarind',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Dessert Pods'), (pid, 'Sweet Variant'), (pid, 'Rare Selection');


  -- ── 28. Amblala (Amla / Indian Gooseberry) ──────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'amblala-indian-gooseberry',
    'Amblala (Indian Gooseberry)',
    'Phyllanthus emblica',
    cat_medicinal,
    'A small-to-medium tree with delicate, feather-like foliage that yields round, striated green fruits known for their intense bitter-sour punch.',
    'One of the most potent natural sources of Vitamin C; serves as the absolute backbone of Ayurvedic health tonics like Chyawanprash.',
    'Deeply worshiped during the festival of Amala Navami, symbolizing long life, robust health, and cleansing.',
    '{"kingdom": "Plantae", "family": "Phyllanthaceae", "genus": "Phyllanthus", "origin": "Tropical South and Southeast Asia"}',
    'https://en.wikipedia.org/wiki/Phyllanthus_emblica',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Vitamin C'), (pid, 'Ayurvedic Pillar'), (pid, 'Longevity');


  -- ── 32. Pipalo (Peepal Tree) ─────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'pipalo-peepal-tree',
    'Pipalo (Peepal Tree)',
    'Ficus religiosa',
    cat_medicinal,
    'A massive, wide-reaching sacred tree easily identified by its distinctive heart-shaped leaves that end in an elongated tip.',
    'Bark extracts are used to soothe stubborn skin ulcers; leaves help settle severe respiratory distress.',
    'The legendary Bodhi Tree under which Gautama Buddha achieved enlightenment, making it sacred to millions globally.',
    '{"kingdom": "Plantae", "family": "Moraceae", "genus": "Ficus", "origin": "Indian subcontinent and Indochina"}',
    'https://en.wikipedia.org/wiki/Ficus_religiosa',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Enlightenment'), (pid, 'Heart Leaves'), (pid, 'Sacred Fig');


  -- ── 33. Deshi Jambu (Wild Indian Black Plum) ────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'deshi-jambu-wild-black-plum',
    'Deshi Jambu (Wild Black Plum)',
    'Syzygium cumini (Wild type)',
    cat_medicinal,
    'The hardy, uncultivated wild strain of the Jamun tree, bearing slightly smaller, astringent purple summer fruits.',
    'The intense bark and seed extracts possess heavy astringent and oral antibacterial qualities used to treat sore gums.',
    'Found widely scattered across wild forest edges and rural farm hedge perimeters throughout mainland India.',
    '{"kingdom": "Plantae", "family": "Myrtaceae", "genus": "Syzygium", "origin": "Indian subcontinent"}',
    'https://en.wikipedia.org/wiki/Syzygium_cumini',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Wild Strain'), (pid, 'High Astringency'), (pid, 'Ecosystem Support');


  -- ── 35. Ar (Arduso / Indian Tree of Heaven) ─────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'ar-arduso',
    'Ar (Arduso)',
    'Ailanthus excelsa',
    cat_medicinal,
    'A large, rapidly growing deciduous tree featuring distinctively long, pinnately compound leaves with coarsely toothed margins.',
    'The bitter bark acts as a powerful traditional febrifuge used to reduce stubborn fevers and soothe respiratory conditions.',
    'Highly valued by dry-land farmers across Gujarat as an emergency fodder tree for livestock during lean periods.',
    '{"kingdom": "Plantae", "family": "Simaroubaceae", "genus": "Ailanthus", "origin": "India (Mainland peninsular regions)"}',
    'https://en.wikipedia.org/wiki/Ailanthus_excelsa',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Livestock Fodder'), (pid, 'Fast Growing'), (pid, 'Bitter Bark');


  -- ═══════════════════════════════════════════════════════════════════════════
  -- RARE & VALUABLE TREES
  -- ═══════════════════════════════════════════════════════════════════════════

  -- ── 17. Saag (Teak) ──────────────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'saag-teak',
    'Saag (Teak)',
    'Tectona grandis',
    cat_rare,
    'A massive deciduous canopy tree with large, sandpapery leaves, renowned for producing arguably the finest timber in the world.',
    'Wood powder paste is used traditionally to ease skin swelling; flowers possess minor natural diuretic properties.',
    'The golden standard for luxury furniture, prized for centuries by shipbuilders for its weather-resistant oils.',
    '{"kingdom": "Plantae", "family": "Lamiaceae", "genus": "Tectona", "origin": "India, Myanmar, and parts of Southeast Asia"}',
    'https://en.wikipedia.org/wiki/Teak',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Luxury Timber'), (pid, 'Weather Resistant'), (pid, 'Teakwood');


  -- ── 18. Laal Chandan (Red Sandalwood) ────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'laal-chandan-red-sandalwood',
    'Laal Chandan (Red Sandalwood)',
    'Pterocarpus santalinus',
    cat_rare,
    'A slow-growing, critically valued tree producing ultra-dense, non-scented wood famous for its rich, ruby-red hue.',
    'Paste is highly valued in traditional medicine for treating inflammation and specialized skin pigmentation.',
    'Endemic to a highly restricted region of India, making it a heavily protected, iconic conservation species.',
    '{"kingdom": "Plantae", "family": "Fabaceae", "genus": "Pterocarpus", "origin": "Seshachalam hills of Andhra Pradesh, India"}',
    'https://en.wikipedia.org/wiki/Pterocarpus_santalinus',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Endangered'), (pid, 'Ruby Wood'), (pid, 'Highly Regulated');


  -- ── 19. Rukhado / Kalpvrukash (African Baobab) ──────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'rukhado-kalpvrukash-baobab',
    'Rukhado (Kalpvrukash / Baobab)',
    'Adansonia digitata',
    cat_rare,
    'An extraordinary, long-lived tree with a massive, swollen bottle-like trunk capable of storing thousands of liters of water.',
    'The dry fruit pulp inside the pods is exceptionally rich in Vitamin C, potassium, and calcium, acting as a natural nutritional prebiotic.',
    'Revered in Gujarat as a living relic (Kalpavriksha or wish-granting tree), these ancient giants were brought to India centuries ago by African traders.',
    '{"kingdom": "Plantae", "family": "Malvaceae", "genus": "Adansonia", "origin": "Arid African savannahs"}',
    'https://en.wikipedia.org/wiki/Adansonia_digitata',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Wish Tree'), (pid, 'Ancient Relic'), (pid, 'Bottle Trunk');


  -- ── 34. Savan (White Teak) ───────────────────────────────────────────────
  INSERT INTO plants (
    slug, name, scientific_name, category_id,
    short_desc, medicinal_uses, folklore, genome_data, wikipedia_url, status
  ) VALUES (
    'savan-white-teak',
    'Savan (White Teak)',
    'Gmelina arborea',
    cat_rare,
    'A beautiful, fast-growing deciduous tree producing attractive yellow-brown trumpet flowers and valuable, lightweight white timber.',
    'The root bark is a vital component of the classical Ayurvedic Dashamula formulation used to treat full-body inflammation.',
    'Its strong, uniquely lightweight wood is traditionally favored for crafting classical Indian musical instruments like sitars and tanpuras.',
    '{"kingdom": "Plantae", "family": "Lamiaceae", "genus": "Gmelina", "origin": "Indian Subcontinent and Southeast Asian forests"}',
    'https://en.wikipedia.org/wiki/Gmelina_arborea',
    'draft'
  ) RETURNING id INTO pid;
  INSERT INTO plant_tags (plant_id, tag) VALUES
    (pid, 'Dashamula Root'), (pid, 'Musical Instruments'), (pid, 'White Teak');


  -- ═══════════════════════════════════════════════════════════════════════════
  RAISE NOTICE '✅ Successfully inserted 35 plants (all as DRAFT status)';
  RAISE NOTICE '📋 Admin can now review, edit, and publish each plant from the dashboard';
  RAISE NOTICE '📱 Use "Generate QR" button in admin to create QR codes when ready';
END $$;
