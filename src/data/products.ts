import { Product } from '../types';

export const CATEGORIES = [
  { id: 'all', name: 'ALL PRODUCTS' },
  { id: 'outerwear', name: 'OUTERWEAR' },
  { id: 'tops', name: 'TOPS & HOODIES' },
  { id: 'bottoms', name: 'BOTTOMS' },
  { id: 'footwear', name: 'FOOTWEAR' },
  { id: 'accessories', name: 'ACCESSORIES' }
];

export const ACTIVITIES = [
  { id: 'running', name: 'RUNNING' },
  { id: 'training', name: 'HIGH INTENSITY TRAINING' },
  { id: 'streetwear', name: 'TECHNICAL STREETWEAR' }
];

export const PRODUCTS: Product[] = [
  {
    id: 'nero-utility-parka',
    name: 'NERO UTILITY PARKA',
    price: 320,
    description: 'A structural, technical waterproof shell engineered for extreme environments and urban exploration. Features a highly modular layout with dual magnetic zip compartments, adjustable storm hood, laser-cut ventilation, and durable matte ripstop fabric.',
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'outerwear',
    activities: ['streetwear', 'training'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Matte Obsidian Black', hex: '#111111' },
      { name: 'Structured Off-White', hex: '#F4F4F5' }
    ],
    rating: 4.9,
    inStock: true,
    highlights: [
      'Waterproof ripstop fabric with welded seams',
      'Fidlock magnetic quick-access cargo chest pockets',
      'Ergonomic multi-panel articulated elbow design',
      'Adjustable cohort-drawcord drop hood and cuffs'
    ],
    specs: {
      material: '100% Recycled Technical Polyester Ripstop with PFC-free DWR coating',
      fit: 'Relaxed athletic silhouette with room for heavy mid-layers',
      care: 'Machine wash cold on gentle cycle. Hang dry in shade. Do not iron seams.'
    }
  },
  {
    id: 'mono-running-tights',
    name: 'MONO COMPRESSION TIGHTS',
    price: 110,
    description: 'Ultra-lightweight high-performance compression tights designed to optimize circulation and speed recovery. Features bonded seams to completely eliminate chafing, breathable mesh behind the knees, and subtle reflective branding for dawn or dusk runs.',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519311965067-36d3e5f1ab55?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'bottoms',
    activities: ['running', 'training'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Charcoal Asphalt', hex: '#374151' }
    ],
    rating: 4.7,
    inStock: true,
    highlights: [
      'High-grade zone-specific muscle compression',
      'Secure back zipper pocket for essential storage',
      'Moisture-wicking, anti-microbial fabric matrix',
      'Flat-locked ergonomic heat-seal seams'
    ],
    specs: {
      material: '78% Regenerated Nylon, 22% Xtra Life Lycra elastane',
      fit: 'Second-skin locked compression fit',
      care: 'Hand wash cold or machine wash delicate. Air dry only. Do not bleach.'
    }
  },
  {
    id: 'cypher-crewneck',
    name: 'CYPHER CREWNECK',
    price: 160,
    description: 'An elevated basic sweatshirt constructed from custom-knit heavy-loopback French Terry. Featuring structured dropped shoulders, raw finished side panels, and minimal seam detailing for a clean industrial visual profile.',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'tops',
    activities: ['streetwear'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Structured Off-White', hex: '#F4F4F5' },
      { name: 'Obsidian Black', hex: '#111111' }
    ],
    rating: 4.8,
    inStock: true,
    highlights: [
      '460GSM ultra-dense French Terry loopback cotton',
      'Garment dyed and enzyme-washed for deep color depth',
      'Heavy double-needle stitch reinforcements',
      'Subtle tonal laser-etched moniker at back collar'
    ],
    specs: {
      material: '100% Organic Ring-spun Cotton',
      fit: 'Oversized, structured boxy silhouette with cropped waist',
      care: 'Wash inside out with similar dark colors. Lay flat to dry.'
    }
  },
  {
    id: 'axis-track-pants',
    name: 'AXIS TECHNICAL PANTS',
    price: 185,
    description: 'The ultimate utility pants transitioning seamlessly from intense training to urban streets. Engineered from lightweight, four-way stretch dynamic fabric with magnetic ankle cinches to quickly modify the silhouette from straight to tapered on the move.',
    images: [
      'https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517438476312-10d79c07750d?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'bottoms',
    activities: ['streetwear', 'training', 'running'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Ghost Gray', hex: '#9CA3AF' }
    ],
    rating: 4.6,
    inStock: true,
    highlights: [
      'Four-way dynamic stretch weave with hydrophobic barrier',
      'Innovative hidden magnetic snap hem adjusters',
      'Waterproof internal zipper pockets with polyurethane laminate',
      'Integrated webbed utility belt with quick-release aluminum tension buckle'
    ],
    specs: {
      material: '88% Technical Nylon, 12% Lycra double-weave',
      fit: 'Semi-relaxed thigh tapering to adjustable ankle cuff',
      care: 'Machine wash cold with like colors. Tumble dry low.'
    }
  },
  {
    id: 'kinetic-compression-tee',
    name: 'KINETIC SEAMLESS TEE',
    price: 85,
    description: 'An advanced activewear shirt crafted with premium zoned-mapping breathability. Engineered to regulate body temperature during high-intensity intervals. Completely seamless core construction reduces friction and moves fluidly with your body.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'tops',
    activities: ['running', 'training'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pure Chalk White', hex: '#FFFFFF' },
      { name: 'Obsidian Black', hex: '#111111' }
    ],
    rating: 4.5,
    inStock: true,
    highlights: [
      'Body-mapped technical ribbing for heat dispersal',
      'Ultra-breathable weave in high-perspiration zones',
      'Silver-ion anti-odor treated yarn technology',
      'Completely seamless circular knit body'
    ],
    specs: {
      material: '92% Nylon microfiber, 8% Elastane silver-infused yarn',
      fit: 'Form-fitting athletic cut',
      care: 'Wash cold inside out. Do not tumble dry to preserve shape.'
    }
  },
  {
    id: 'spectre-oversized-hoodie',
    name: 'SPECTRE DOUBLE HOODIE',
    price: 210,
    description: 'A heavyweight dual-layered fleece pullover optimized for cold-weather layering and architectural aesthetic value. Featuring an expansive double-thickness hood, deep kangaroo pouch with hidden zip pocket, and extra thick elasticated hem ribbing.',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'tops',
    activities: ['streetwear'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal Asphalt', hex: '#374151' },
      { name: 'Obsidian Black', hex: '#111111' }
    ],
    rating: 4.9,
    inStock: true,
    highlights: [
      'Double-lined ultra-heavy fleece matrix (520GSM)',
      'Hidden interior zippered pouch for device protection',
      'Drop shoulders and architectural visual sleeve panels',
      'Ribbed side gussets for enhanced elastic mobility'
    ],
    specs: {
      material: '80% Organic Cotton, 20% Polyester premium heavyweight fleece',
      fit: 'Cropped, boxy, heavily structured oversized fit',
      care: 'Dry clean recommended or machine wash cold inside out, lay flat to dry.'
    }
  },
  {
    id: 'orbit-runner-v1',
    name: 'ORBIT RUNNER V1',
    price: 245,
    description: 'Designed at the convergence of rugged trail capability and hyper-refined streetwear aesthetics. Features a proprietary carbon-plate spring-matrix core, high-abrasion engineered knit upper, matte rubber structural support cages, and speed-lock toggle lacing.',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'footwear',
    activities: ['running', 'training', 'streetwear'],
    sizes: ['8', '9', '10', '11', '12'],
    colors: [
      { name: 'Matte Obsidian Black', hex: '#111111' },
      { name: 'Ghost Slate White', hex: '#E5E7EB' }
    ],
    rating: 4.9,
    inStock: true,
    highlights: [
      'Carbon-fiber speed plate inserts for high energy return',
      'Vibram Megagrip lug outsole for wet/dry micro-traction',
      'Elastic breathable knit bootie inner sleeve fit',
      'Fidlock/speed-lace magnetic locking mechanism'
    ],
    specs: {
      material: 'Engineered TPU knit yarn with protective rubberized overlays',
      fit: 'True to size with locked-in ankle collar',
      care: 'Wipe clean with soft damp cloth. Air dry. Hand wash footbeds.'
    }
  },
  {
    id: 'aero-active-shorts',
    name: 'AERO SPLIT-SEAM SHORTS',
    price: 75,
    description: 'Extremely lightweight, ventilated activewear shorts designed for absolute maximum stride length. Built with a supportive, ultra-breathable mesh liner that wicks moisture instantly to maintain optimal cooling comfort during hot summer runs.',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519311965067-36d3e5f1ab55?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'bottoms',
    activities: ['running', 'training'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Pure Chalk White', hex: '#FFFFFF' }
    ],
    rating: 4.4,
    inStock: false, // For testing sold-out states!
    highlights: [
      'Ultra-thin perforated micro-stretch outer shell',
      'Anti-chafing high-wicking inner knit boxer liner',
      'Bonded back key/card envelope pocket',
      'Low-profile comfortable elastic mesh waistband'
    ],
    specs: {
      material: 'Shell: 86% Polyester, 14% Elastane; Liner: 90% Polyester, 10% Nylon',
      fit: 'Active split-side cut, 5-inch inseam',
      care: 'Machine wash cold. Tumble dry ultra low.'
    }
  },
  {
    id: 'minimalist-duffel-bag',
    name: 'MONO UTILITY DUFFEL',
    price: 130,
    description: 'An architectural carryall bag constructed from heavy-duty matte waterproof polyurethane-coated nylon. Offers a dedicated ventilated footwear compartment, rapid-access magnetic slip pockets, and adjustable ergonomic shoulder padding.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'accessories',
    activities: ['training', 'streetwear'],
    sizes: ['One Size'],
    colors: [
      { name: 'Matte Obsidian Black', hex: '#111111' }
    ],
    rating: 4.8,
    inStock: true,
    highlights: [
      'Waterproof seam-sealed polyurethane build',
      'Dedicated isolated side ventilation shoe pocket',
      'Removable quick-adjust seatbelt padded shoulder strap',
      'Matte waterproof zippers and premium alloy buckles'
    ],
    specs: {
      material: '1680D TPU coated premium ballistic nylon matrix',
      fit: '38 Liter holding capacity - meets global carry-on sizes',
      care: 'Spot clean exterior with soft sponge and mild soap.'
    }
  }
];

export const PROMO_TILES = [
  {
    title: 'THE CORE COMPRESSION SERIES',
    subtitle: 'Zero-friction baselayers engineered for peak physical velocity.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    link: 'running',
    type: 'activity'
  },
  {
    title: 'ARCHITECTURAL OUTERS',
    subtitle: 'Technical utility shells matching extreme performance with sharp minimal designs.',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
    link: 'outerwear',
    type: 'category'
  }
];

export const FAQS = [
  {
    question: 'How do I determine the correct sizing for compression versus technical outerwear?',
    answer: 'Compression items are engineered to fit tight like a second skin to support muscle groups. We recommend purchasing your normal size for true compression. For our outerwear jackets (like the Nero Parka), the cut is slightly relaxed to allow proper mid-weight insulation layers underneath; if you prefer a slim profile, consider sizing down one level.'
  },
  {
    question: 'Is LankaPay fully integrated for international checkout options?',
    answer: 'Yes! LankaPay serves as our primary secure sandbox gateway, allowing users to safely checkout using international or localized cards and account numbers. In the Checkout portal, selecting LankaPay initiates a secure encrypted payment simulation that authenticates and verifies funds instantly.'
  },
  {
    question: 'What is your return and carbon-neutral trade-in policy?',
    answer: 'We offer an unconditional 30-day return policy for all unworn gear in its original packaging. Additionally, as part of our sustainability program, any IVORY items can be returned after heavy wear for a 20% recycled trade-in store credit.'
  },
  {
    question: 'How do technical fabrics perform under continuous washing?',
    answer: 'Our proprietary Silver-ion and ripstop fibers are highly resilient. To maximize performance lifespan, we recommend washing technical gear inside out in cold water on gentle cycles, and completely avoiding fabric softeners or heat drying which can degrade elastane and waterproof membranes.'
  }
];
