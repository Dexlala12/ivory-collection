export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[]; // High quality Unsplash URLs
  category: string; // e.g., 'tops', 'bottoms', 'outerwear', 'footwear', 'accessories'
  activities: string[]; // e.g., 'running', 'training', 'streetwear'
  sizes: string[];
  colors: { name: string; hex: string }[];
  rating: number;
  inStock: boolean;
  highlights: string[];
  specs: {
    material: string;
    fit: string;
    care: string;
  };
  sortOrder?: number;
}

export interface CartItem {
  id: string; // Unique combination of product.id + size + color
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    shippingMethod: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'success' | 'failed';
  createdAt: string;
}

export type ActivePage = 
  | 'home' 
  | 'collection' 
  | 'product' 
  | 'cart' 
  | 'checkout' 
  | 'static' 
  | 'search';

export type StaticPageType = 'faq' | 'contact' | 'terms' | 'privacy' | 'about';

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  activities: string[];
  priceRange: [number, number];
  onlyInStock: boolean;
}

// ---------------------------------------------------------------------------
// CMS content types — everything below is managed from the admin portal
// (see src/admin) and read at runtime by SiteContentContext.
// ---------------------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export interface Activity {
  id: string;
  name: string;
  sortOrder: number;
}

export interface PromoTile {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  type: 'category' | 'activity';
  sortOrder: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface PageSection {
  heading: string | null;
  paragraphs: string[];
}

export interface PageImage {
  url: string;
  caption: string;
}

export type PageSlug = 'about' | 'terms' | 'privacy';

export interface Page {
  slug: PageSlug;
  title: string;
  subtitle: string;
  heading: string;
  sections: PageSection[];
  images: PageImage[];
}

// Where a footer/nav link sends the visitor. 'collection' opens the shop;
// the rest open the static page of the same name.
export type LinkTarget = 'home' | 'collection' | 'about' | 'contact' | 'faq' | 'terms' | 'privacy';

export interface FooterLink {
  label: string;
  target: LinkTarget;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface HeaderContent {
  announcement: string;
  navLabels: { home: string; shop: string; concept: string; contact: string };
  megaMenu: { tag: string; heading: string; image: string };
}

export interface FooterContent {
  newsletterHeading: string;
  newsletterBody: string;
  columns: FooterColumn[];
  copyright: string;
  complianceBadge: string;
}

export interface HomeHeroContent {
  eyebrow: string;
  heading: string; // "\n" marks a manual line break, matching the storefront's two-line hero
  subheading: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
}

export interface Settings {
  whatsappNumber: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  bankSwiftCode: string;
  freeShippingThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
  taxRate: number;
}

export interface PromoCode {
  id: string;
  code: string;
  rate: number;
  active: boolean;
}

export interface Profile {
  id: string;
  email: string;
  createdAt: string;
}
