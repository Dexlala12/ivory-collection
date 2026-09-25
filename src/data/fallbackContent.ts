// Fallback content used when the Supabase backend isn't configured yet (no
// VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY) or a fetch fails — keeps the
// storefront fully functional before/without the admin backend. Mirrors
// supabase/seed.sql exactly; source of truth for products/categories/
// activities/promo tiles/FAQs is data/products.ts (also used to build
// supabase/seed.sql), everything else is defined here.
import { CATEGORIES, ACTIVITIES, PROMO_TILES, FAQS } from './products';
import type {
  Category, Activity, PromoTile, Faq, Page, PageSlug,
  HeaderContent, FooterContent, HomeHeroContent, Settings, PromoCode
} from '../types';

export const FALLBACK_CATEGORIES: Category[] = CATEGORIES
  .filter((c) => c.id !== 'all')
  .map((c, i) => ({ id: c.id, name: c.name, sortOrder: (i + 1) * 10 }));

export const FALLBACK_ACTIVITIES: Activity[] = ACTIVITIES.map((a, i) => ({
  id: a.id, name: a.name, sortOrder: (i + 1) * 10
}));

export const FALLBACK_PROMO_TILES: PromoTile[] = PROMO_TILES.map((t, i) => ({
  id: `fallback-tile-${i}`, title: t.title, subtitle: t.subtitle, image: t.image,
  link: t.link, type: t.type as 'category' | 'activity', sortOrder: (i + 1) * 10
}));

export const FALLBACK_FAQS: Faq[] = FAQS.map((f, i) => ({
  id: `fallback-faq-${i}`, question: f.question, answer: f.answer, sortOrder: (i + 1) * 10
}));

export const FALLBACK_PAGES: Record<PageSlug, Page> = {
  about: {
    slug: 'about',
    title: 'THE IVORY CONCEPT',
    subtitle: 'Fibers and algorithms synthesized for peak performance.',
    heading: '',
    sections: [
      {
        heading: 'THE STRUCTURAL PHENOMENON',
        paragraphs: [
          `Founded in ${new Date().getFullYear() - 3} as an experimental textiles workshop, IVORY specializes in technical, high-compression baselayers and modular outerwear. Our design core believes in strict minimal aesthetics, utilizing only absolute black and white palettes, letting shadows, negative space, and physical cuts highlight organic muscle geometry.`,
          'Every performance activewear item we compile undergoes extreme load metric testing to ensure absolute zero seam-friction, maximal stride potential, and advanced heat dispersion mapping. By combining regenerated nylon yarns with carbon-plate spring lattices, we synthesize raw physical speed with long-lasting structural durability.'
        ]
      },
      {
        heading: 'OUR ENVIRONMENTAL COMPACT',
        paragraphs: [
          'All IVORY products are compiled using either 100% organic ring-spun cotton or regenerated ocean plastics (Econyl). We refuse cheap, throwaway blends. In addition, we operate an unconditional circular trade-in matrix: returning old IVORY garments entitles you to 20% credit, allowing us to grind down old fabrics to formulate next-generation raw performance yarns.'
        ]
      }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop', caption: 'STRESS GRADING EXPERIMENT 02' },
      { url: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=600&auto=format&fit=crop', caption: 'CIRCULAR WEAVE ASSEMBLY WORKSHOP' }
    ]
  },
  terms: {
    slug: 'terms',
    title: 'TERMS OF UTILITY',
    subtitle: 'Core legal boundaries and transaction specifications.',
    heading: 'IVORY CORE TERMS OF UTILITY',
    sections: [
      { heading: null, paragraphs: ['Welcome to the IVORY apparel network system. By accessing this terminal, purchasing technical outerwear, or utilizing LankaPay simulation pipelines, you agree to comply with our global terms of utility.'] },
      { heading: '1. APPAREL ALLOCATION LIMITS', paragraphs: ['IVORY garments are constructed in restricted batches. Adding products to your cart does not lock down stock. Stock ownership is allocated strictly upon successful transaction clearance via LankaPay or credit networks.'] },
      { heading: '2. CIRCULAR RECYCLING INITIATIVE', paragraphs: ['Returning worn IVORY items to our Sri Lankan Concept stores triggers a 20% trade-in credit. The returned item ceases to belong to you and is immediately entered into our fabric grind-recompile pipeline.'] },
      { heading: '3. LANKAPAY® SANDBOX LIABILITY', paragraphs: ['This application storefront contains an active sandbox payment simulator for LankaPay, utilizing fake mock numbers to verify orders. IVORY takes no responsibility for users who attempt to enter genuine personal banking pins into this browser-level sandbox.'] }
    ],
    images: []
  },
  privacy: {
    slug: 'privacy',
    title: 'PRIVACY POLICY',
    subtitle: 'Secure data encryption standards and privacy values.',
    heading: 'SECURE DATA PRIVACY DISCLOSURES',
    sections: [
      { heading: null, paragraphs: ['We are deeply committed to protecting customer data. IVORY implements AES-256 bank-grade network encryption standards across all digital checkout portals.'] },
      { heading: '1. TRANSACTION DATA SEGREGATION', paragraphs: ['Your banking accounts and cards processed through the LankaPay gateway are fully encrypted and validated inside simulated sandboxed frames. No raw personal numbers or validation pins are stored in local browser registries.'] },
      { heading: '2. PRIVACY COOKIES & DISPATCH TRACKING', paragraphs: ['We only utilize standard, non-invasive cookies to manage cart arrays and keep track of active sessions. We do not sell, license, or dispatch your contact details to third-party marketing brokers.'] },
      { heading: '3. COMMUNICATIONS ENROLLMENT', paragraphs: ['Signing up for our core newsletters binds your email strictly to physical garment drops, design concept briefs, and exclusive event codes. You are free to deactivate or unsubscribe at any instant.'] }
    ],
    images: []
  }
};

export const FALLBACK_HEADER: HeaderContent = {
  announcement: 'COMPLIMENTARY SHIPPING FOR ORDERS OVER $150 • SECURED WITH LANKAPAY® SANDBOX',
  navLabels: { home: 'HOME', shop: 'SHOP', concept: 'CONCEPT', contact: 'CONNECT' },
  megaMenu: {
    tag: 'NEW ENTRANT',
    heading: 'THE COMPRESSION BASICS',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop'
  }
};

export const FALLBACK_FOOTER: FooterContent = {
  newsletterHeading: 'NEWSLETTER BRIEFINGS',
  newsletterBody: 'Subscribe to receive technical product releases, environmental research updates, and early access codes.',
  columns: [
    { heading: 'SITEMAP / SHOP', links: [
      { label: 'ALL APPAREL', target: 'collection' },
      { label: 'NEW ARRIVALS', target: 'collection' },
      { label: 'THE COMPRESSION SERIES', target: 'about' }
    ] },
    { heading: 'INFORMATION', links: [
      { label: 'THE CONCEPT (IVORY)', target: 'about' },
      { label: 'STORES & ENERGETIC HUB', target: 'contact' },
      { label: 'SUPPORT CENTRE / FAQ', target: 'faq' }
    ] },
    { heading: 'POLICIES', links: [
      { label: 'TERMS OF UTILITY', target: 'terms' },
      { label: 'PRIVACY DISCLOSURES', target: 'privacy' },
      { label: 'RETURNS & EXCHANGE', target: 'faq' }
    ] }
  ],
  copyright: 'IVORY STUDIO INC. ALL RIGHTS RESERVED.',
  complianceBadge: 'LANKAPAY SANDBOX COMPLIANT'
};

export const FALLBACK_HOME_HERO: HomeHeroContent = {
  eyebrow: 'IVORY PERFORMANCE SYSTEMS',
  heading: 'ENGINEERED FOR\nPHYSICAL VELOCITY',
  subheading: 'An architectural capsule of high-compression baselayers and technical outerwear. Synthesizing athletic function with strict minimal geometry.',
  primaryCtaLabel: 'SHOP NEW RELEASES',
  secondaryCtaLabel: 'TECHNICAL CAPSULES'
};

export const FALLBACK_SETTINGS: Settings = {
  whatsappNumber: '94700000000',
  bankName: 'PLACEHOLDER BANK NAME',
  bankAccountName: 'IVORY (PVT) LTD',
  bankAccountNumber: '0000 0000 0000',
  bankBranch: 'PLACEHOLDER BRANCH, COLOMBO',
  bankSwiftCode: 'PLACEHOLDERXXX',
  freeShippingThreshold: 150,
  standardShippingCost: 15,
  expressShippingCost: 25,
  taxRate: 0.08
};

export const FALLBACK_PROMO_CODES: PromoCode[] = [
  { id: 'fallback-neo15', code: 'NEO15', rate: 0.15, active: true }
];
