-- IVORY — seed data
-- Run AFTER schema.sql. Populates every content table with the site's current
-- (pre-CMS) copy, so the storefront looks identical the moment it switches
-- over to reading from Supabase. Safe to re-run — every insert upserts.

-- ============================================================================
-- CATEGORIES / ACTIVITIES
-- ============================================================================
insert into public.categories (id, name, sort_order) values
  ('outerwear', 'OUTERWEAR', 10),
  ('tops', 'TOPS & HOODIES', 20),
  ('bottoms', 'BOTTOMS', 30),
  ('footwear', 'FOOTWEAR', 40),
  ('accessories', 'ACCESSORIES', 50)
on conflict (id) do update set name = excluded.name, sort_order = excluded.sort_order;

insert into public.activities (id, name, sort_order) values
  ('running', 'RUNNING', 10),
  ('training', 'HIGH INTENSITY TRAINING', 20),
  ('streetwear', 'TECHNICAL STREETWEAR', 30)
on conflict (id) do update set name = excluded.name, sort_order = excluded.sort_order;

-- ============================================================================
-- PRODUCTS
-- ============================================================================
insert into public.products (id, name, price, description, images, category, activities, sizes, colors, rating, in_stock, highlights, specs, sort_order) values
(
  'nero-utility-parka', 'NERO UTILITY PARKA', 320,
  'A structural, technical waterproof shell engineered for extreme environments and urban exploration. Features a highly modular layout with dual magnetic zip compartments, adjustable storm hood, laser-cut ventilation, and durable matte ripstop fabric.',
  array['https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop'],
  'outerwear', array['streetwear','training'], array['S','M','L','XL'],
  '[{"name":"Matte Obsidian Black","hex":"#111111"},{"name":"Structured Off-White","hex":"#F4F4F5"}]',
  4.9, true,
  array['Waterproof ripstop fabric with welded seams','Fidlock magnetic quick-access cargo chest pockets','Ergonomic multi-panel articulated elbow design','Adjustable cohort-drawcord drop hood and cuffs'],
  '{"material":"100% Recycled Technical Polyester Ripstop with PFC-free DWR coating","fit":"Relaxed athletic silhouette with room for heavy mid-layers","care":"Machine wash cold on gentle cycle. Hang dry in shade. Do not iron seams."}',
  10
),
(
  'mono-running-tights', 'MONO COMPRESSION TIGHTS', 110,
  'Ultra-lightweight high-performance compression tights designed to optimize circulation and speed recovery. Features bonded seams to completely eliminate chafing, breathable mesh behind the knees, and subtle reflective branding for dawn or dusk runs.',
  array['https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1519311965067-36d3e5f1ab55?q=80&w=800&auto=format&fit=crop'],
  'bottoms', array['running','training'], array['XS','S','M','L'],
  '[{"name":"Obsidian Black","hex":"#111111"},{"name":"Charcoal Asphalt","hex":"#374151"}]',
  4.7, true,
  array['High-grade zone-specific muscle compression','Secure back zipper pocket for essential storage','Moisture-wicking, anti-microbial fabric matrix','Flat-locked ergonomic heat-seal seams'],
  '{"material":"78% Regenerated Nylon, 22% Xtra Life Lycra elastane","fit":"Second-skin locked compression fit","care":"Hand wash cold or machine wash delicate. Air dry only. Do not bleach."}',
  20
),
(
  'cypher-crewneck', 'CYPHER CREWNECK', 160,
  'An elevated basic sweatshirt constructed from custom-knit heavy-loopback French Terry. Featuring structured dropped shoulders, raw finished side panels, and minimal seam detailing for a clean industrial visual profile.',
  array['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'],
  'tops', array['streetwear'], array['S','M','L','XL'],
  '[{"name":"Structured Off-White","hex":"#F4F4F5"},{"name":"Obsidian Black","hex":"#111111"}]',
  4.8, true,
  array['460GSM ultra-dense French Terry loopback cotton','Garment dyed and enzyme-washed for deep color depth','Heavy double-needle stitch reinforcements','Subtle tonal laser-etched moniker at back collar'],
  '{"material":"100% Organic Ring-spun Cotton","fit":"Oversized, structured boxy silhouette with cropped waist","care":"Wash inside out with similar dark colors. Lay flat to dry."}',
  30
),
(
  'axis-track-pants', 'AXIS TECHNICAL PANTS', 185,
  'The ultimate utility pants transitioning seamlessly from intense training to urban streets. Engineered from lightweight, four-way stretch dynamic fabric with magnetic ankle cinches to quickly modify the silhouette from straight to tapered on the move.',
  array['https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1517438476312-10d79c07750d?q=80&w=800&auto=format&fit=crop'],
  'bottoms', array['streetwear','training','running'], array['S','M','L','XL'],
  '[{"name":"Obsidian Black","hex":"#111111"},{"name":"Ghost Gray","hex":"#9CA3AF"}]',
  4.6, true,
  array['Four-way dynamic stretch weave with hydrophobic barrier','Innovative hidden magnetic snap hem adjusters','Waterproof internal zipper pockets with polyurethane laminate','Integrated webbed utility belt with quick-release aluminum tension buckle'],
  '{"material":"88% Technical Nylon, 12% Lycra double-weave","fit":"Semi-relaxed thigh tapering to adjustable ankle cuff","care":"Machine wash cold with like colors. Tumble dry low."}',
  40
),
(
  'kinetic-compression-tee', 'KINETIC SEAMLESS TEE', 85,
  'An advanced activewear shirt crafted with premium zoned-mapping breathability. Engineered to regulate body temperature during high-intensity intervals. Completely seamless core construction reduces friction and moves fluidly with your body.',
  array['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop'],
  'tops', array['running','training'], array['S','M','L','XL'],
  '[{"name":"Pure Chalk White","hex":"#FFFFFF"},{"name":"Obsidian Black","hex":"#111111"}]',
  4.5, true,
  array['Body-mapped technical ribbing for heat dispersal','Ultra-breathable weave in high-perspiration zones','Silver-ion anti-odor treated yarn technology','Completely seamless circular knit body'],
  '{"material":"92% Nylon microfiber, 8% Elastane silver-infused yarn","fit":"Form-fitting athletic cut","care":"Wash cold inside out. Do not tumble dry to preserve shape."}',
  50
),
(
  'spectre-oversized-hoodie', 'SPECTRE DOUBLE HOODIE', 210,
  'A heavyweight dual-layered fleece pullover optimized for cold-weather layering and architectural aesthetic value. Featuring an expansive double-thickness hood, deep kangaroo pouch with hidden zip pocket, and extra thick elasticated hem ribbing.',
  array['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'],
  'tops', array['streetwear'], array['S','M','L','XL'],
  '[{"name":"Charcoal Asphalt","hex":"#374151"},{"name":"Obsidian Black","hex":"#111111"}]',
  4.9, true,
  array['Double-lined ultra-heavy fleece matrix (520GSM)','Hidden interior zippered pouch for device protection','Drop shoulders and architectural visual sleeve panels','Ribbed side gussets for enhanced elastic mobility'],
  '{"material":"80% Organic Cotton, 20% Polyester premium heavyweight fleece","fit":"Cropped, boxy, heavily structured oversized fit","care":"Dry clean recommended or machine wash cold inside out, lay flat to dry."}',
  60
),
(
  'orbit-runner-v1', 'ORBIT RUNNER V1', 245,
  'Designed at the convergence of rugged trail capability and hyper-refined streetwear aesthetics. Features a proprietary carbon-plate spring-matrix core, high-abrasion engineered knit upper, matte rubber structural support cages, and speed-lock toggle lacing.',
  array['https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop'],
  'footwear', array['running','training','streetwear'], array['8','9','10','11','12'],
  '[{"name":"Matte Obsidian Black","hex":"#111111"},{"name":"Ghost Slate White","hex":"#E5E7EB"}]',
  4.9, true,
  array['Carbon-fiber speed plate inserts for high energy return','Vibram Megagrip lug outsole for wet/dry micro-traction','Elastic breathable knit bootie inner sleeve fit','Fidlock/speed-lace magnetic locking mechanism'],
  '{"material":"Engineered TPU knit yarn with protective rubberized overlays","fit":"True to size with locked-in ankle collar","care":"Wipe clean with soft damp cloth. Air dry. Hand wash footbeds."}',
  70
),
(
  'aero-active-shorts', 'AERO SPLIT-SEAM SHORTS', 75,
  'Extremely lightweight, ventilated activewear shorts designed for absolute maximum stride length. Built with a supportive, ultra-breathable mesh liner that wicks moisture instantly to maintain optimal cooling comfort during hot summer runs.',
  array['https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1519311965067-36d3e5f1ab55?q=80&w=800&auto=format&fit=crop'],
  'bottoms', array['running','training'], array['S','M','L','XL'],
  '[{"name":"Obsidian Black","hex":"#111111"},{"name":"Pure Chalk White","hex":"#FFFFFF"}]',
  4.4, false, -- sold out, for testing sold-out states
  array['Ultra-thin perforated micro-stretch outer shell','Anti-chafing high-wicking inner knit boxer liner','Bonded back key/card envelope pocket','Low-profile comfortable elastic mesh waistband'],
  '{"material":"Shell: 86% Polyester, 14% Elastane; Liner: 90% Polyester, 10% Nylon","fit":"Active split-side cut, 5-inch inseam","care":"Machine wash cold. Tumble dry ultra low."}',
  80
),
(
  'minimalist-duffel-bag', 'MONO UTILITY DUFFEL', 130,
  'An architectural carryall bag constructed from heavy-duty matte waterproof polyurethane-coated nylon. Offers a dedicated ventilated footwear compartment, rapid-access magnetic slip pockets, and adjustable ergonomic shoulder padding.',
  array['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'],
  'accessories', array['training','streetwear'], array['One Size'],
  '[{"name":"Matte Obsidian Black","hex":"#111111"}]',
  4.8, true,
  array['Waterproof seam-sealed polyurethane build','Dedicated isolated side ventilation shoe pocket','Removable quick-adjust seatbelt padded shoulder strap','Matte waterproof zippers and premium alloy buckles'],
  '{"material":"1680D TPU coated premium ballistic nylon matrix","fit":"38 Liter holding capacity - meets global carry-on sizes","care":"Spot clean exterior with soft sponge and mild soap."}',
  90
)
on conflict (id) do update set
  name = excluded.name, price = excluded.price, description = excluded.description,
  images = excluded.images, category = excluded.category, activities = excluded.activities,
  sizes = excluded.sizes, colors = excluded.colors, rating = excluded.rating,
  in_stock = excluded.in_stock, highlights = excluded.highlights, specs = excluded.specs,
  sort_order = excluded.sort_order, updated_at = now();

-- ============================================================================
-- PROMO TILES (Home page 2-up feature block)
-- ============================================================================
insert into public.promo_tiles (title, subtitle, image, link, type, sort_order) values
  ('THE CORE COMPRESSION SERIES', 'Zero-friction baselayers engineered for peak physical velocity.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop', 'running', 'activity', 10),
  ('ARCHITECTURAL OUTERS', 'Technical utility shells matching extreme performance with sharp minimal designs.', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop', 'outerwear', 'category', 20);

-- ============================================================================
-- FAQS
-- ============================================================================
insert into public.faqs (question, answer, sort_order) values
(
  'How do I determine the correct sizing for compression versus technical outerwear?',
  'Compression items are engineered to fit tight like a second skin to support muscle groups. We recommend purchasing your normal size for true compression. For our outerwear jackets (like the Nero Parka), the cut is slightly relaxed to allow proper mid-weight insulation layers underneath; if you prefer a slim profile, consider sizing down one level.',
  10
),
(
  'Is LankaPay fully integrated for international checkout options?',
  'Yes! LankaPay serves as our primary secure sandbox gateway, allowing users to safely checkout using international or localized cards and account numbers. In the Checkout portal, selecting LankaPay initiates a secure encrypted payment simulation that authenticates and verifies funds instantly.',
  20
),
(
  'What is your return and carbon-neutral trade-in policy?',
  'We offer an unconditional 30-day return policy for all unworn gear in its original packaging. Additionally, as part of our sustainability program, any IVORY items can be returned after heavy wear for a 20% recycled trade-in store credit.',
  30
),
(
  'How do technical fabrics perform under continuous washing?',
  'Our proprietary Silver-ion and ripstop fibers are highly resilient. To maximize performance lifespan, we recommend washing technical gear inside out in cold water on gentle cycles, and completely avoiding fabric softeners or heat drying which can degrade elastane and waterproof membranes.',
  40
);

-- ============================================================================
-- STATIC PAGES — About / Terms / Privacy
-- ============================================================================
insert into public.pages (slug, title, subtitle, heading, sections, images) values
(
  'about', 'THE IVORY CONCEPT', 'Fibers and algorithms synthesized for peak performance.', '',
  ('[
    {"heading":"THE STRUCTURAL PHENOMENON","paragraphs":[
      "Founded in ' || (extract(year from now())::int - 3) || ' as an experimental textiles workshop, IVORY specializes in technical, high-compression baselayers and modular outerwear. Our design core believes in strict minimal aesthetics, utilizing only absolute black and white palettes, letting shadows, negative space, and physical cuts highlight organic muscle geometry.",
      "Every performance activewear item we compile undergoes extreme load metric testing to ensure absolute zero seam-friction, maximal stride potential, and advanced heat dispersion mapping. By combining regenerated nylon yarns with carbon-plate spring lattices, we synthesize raw physical speed with long-lasting structural durability."
    ]},
    {"heading":"OUR ENVIRONMENTAL COMPACT","paragraphs":[
      "All IVORY products are compiled using either 100% organic ring-spun cotton or regenerated ocean plastics (Econyl). We refuse cheap, throwaway blends. In addition, we operate an unconditional circular trade-in matrix: returning old IVORY garments entitles you to 20% credit, allowing us to grind down old fabrics to formulate next-generation raw performance yarns."
    ]}
  ]')::jsonb,
  '[
    {"url":"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop","caption":"STRESS GRADING EXPERIMENT 02"},
    {"url":"https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=600&auto=format&fit=crop","caption":"CIRCULAR WEAVE ASSEMBLY WORKSHOP"}
  ]'::jsonb
),
(
  'terms', 'TERMS OF UTILITY', 'Core legal boundaries and transaction specifications.', 'IVORY CORE TERMS OF UTILITY',
  '[
    {"heading":null,"paragraphs":["Welcome to the IVORY apparel network system. By accessing this terminal, purchasing technical outerwear, or utilizing LankaPay simulation pipelines, you agree to comply with our global terms of utility."]},
    {"heading":"1. APPAREL ALLOCATION LIMITS","paragraphs":["IVORY garments are constructed in restricted batches. Adding products to your cart does not lock down stock. Stock ownership is allocated strictly upon successful transaction clearance via LankaPay or credit networks."]},
    {"heading":"2. CIRCULAR RECYCLING INITIATIVE","paragraphs":["Returning worn IVORY items to our Sri Lankan Concept stores triggers a 20% trade-in credit. The returned item ceases to belong to you and is immediately entered into our fabric grind-recompile pipeline."]},
    {"heading":"3. LANKAPAY® SANDBOX LIABILITY","paragraphs":["This application storefront contains an active sandbox payment simulator for LankaPay, utilizing fake mock numbers to verify orders. IVORY takes no responsibility for users who attempt to enter genuine personal banking pins into this browser-level sandbox."]}
  ]'::jsonb,
  '[]'::jsonb
),
(
  'privacy', 'PRIVACY POLICY', 'Secure data encryption standards and privacy values.', 'SECURE DATA PRIVACY DISCLOSURES',
  '[
    {"heading":null,"paragraphs":["We are deeply committed to protecting customer data. IVORY implements AES-256 bank-grade network encryption standards across all digital checkout portals."]},
    {"heading":"1. TRANSACTION DATA SEGREGATION","paragraphs":["Your banking accounts and cards processed through the LankaPay gateway are fully encrypted and validated inside simulated sandboxed frames. No raw personal numbers or validation pins are stored in local browser registries."]},
    {"heading":"2. PRIVACY COOKIES & DISPATCH TRACKING","paragraphs":["We only utilize standard, non-invasive cookies to manage cart arrays and keep track of active sessions. We do not sell, license, or dispatch your contact details to third-party marketing brokers."]},
    {"heading":"3. COMMUNICATIONS ENROLLMENT","paragraphs":["Signing up for our core newsletters binds your email strictly to physical garment drops, design concept briefs, and exclusive event codes. You are free to deactivate or unsubscribe at any instant."]}
  ]'::jsonb,
  '[]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title, subtitle = excluded.subtitle, heading = excluded.heading,
  sections = excluded.sections, images = excluded.images, updated_at = now();

-- ============================================================================
-- SITE CONTENT — header / footer / home hero
-- ============================================================================
insert into public.site_content (key, value) values
(
  'header',
  '{
    "announcement": "COMPLIMENTARY SHIPPING FOR ORDERS OVER $150 • SECURED WITH LANKAPAY® SANDBOX",
    "navLabels": { "home": "HOME", "shop": "SHOP", "concept": "CONCEPT", "contact": "CONNECT" },
    "megaMenu": {
      "tag": "NEW ENTRANT",
      "heading": "THE COMPRESSION BASICS",
      "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop"
    }
  }'::jsonb
),
(
  'footer',
  '{
    "newsletterHeading": "NEWSLETTER BRIEFINGS",
    "newsletterBody": "Subscribe to receive technical product releases, environmental research updates, and early access codes.",
    "columns": [
      { "heading": "SITEMAP / SHOP", "links": [
        { "label": "ALL APPAREL", "target": "collection" },
        { "label": "NEW ARRIVALS", "target": "collection" },
        { "label": "THE COMPRESSION SERIES", "target": "about" }
      ]},
      { "heading": "INFORMATION", "links": [
        { "label": "THE CONCEPT (IVORY)", "target": "about" },
        { "label": "STORES & ENERGETIC HUB", "target": "contact" },
        { "label": "SUPPORT CENTRE / FAQ", "target": "faq" }
      ]},
      { "heading": "POLICIES", "links": [
        { "label": "TERMS OF UTILITY", "target": "terms" },
        { "label": "PRIVACY DISCLOSURES", "target": "privacy" },
        { "label": "RETURNS & EXCHANGE", "target": "faq" }
      ]}
    ],
    "copyright": "IVORY STUDIO INC. ALL RIGHTS RESERVED.",
    "complianceBadge": "LANKAPAY SANDBOX COMPLIANT"
  }'::jsonb
),
(
  'home_hero',
  '{
    "eyebrow": "IVORY PERFORMANCE SYSTEMS",
    "heading": "ENGINEERED FOR\nPHYSICAL VELOCITY",
    "subheading": "An architectural capsule of high-compression baselayers and technical outerwear. Synthesizing athletic function with strict minimal geometry.",
    "primaryCtaLabel": "SHOP NEW RELEASES",
    "secondaryCtaLabel": "TECHNICAL CAPSULES"
  }'::jsonb
)
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ============================================================================
-- SETTINGS (single row) + PROMO CODES
-- ============================================================================
insert into public.settings (
  id, whatsapp_number, bank_name, bank_account_name, bank_account_number, bank_branch, bank_swift_code,
  free_shipping_threshold, standard_shipping_cost, express_shipping_cost, tax_rate
) values (
  1, '94700000000', 'PLACEHOLDER BANK NAME', 'IVORY (PVT) LTD', '0000 0000 0000', 'PLACEHOLDER BRANCH, COLOMBO', 'PLACEHOLDERXXX',
  150, 15, 25, 0.08
)
on conflict (id) do nothing;

insert into public.promo_codes (code, rate, active) values
  ('NEO15', 0.15, true)
on conflict (code) do nothing;
