import { supabase } from './supabase';
import type {
  Product, Category, Activity, PromoTile, Faq, Page, PageSlug,
  HeaderContent, FooterContent, HomeHeroContent, Settings, PromoCode, Profile, StaffRole
} from '../types';

// ============================================================================
// Row → app-type mappers (DB is snake_case, the app is camelCase)
// ============================================================================

function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    description: row.description,
    images: row.images ?? [],
    category: row.category,
    activities: row.activities ?? [],
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    rating: Number(row.rating),
    inStock: row.in_stock,
    highlights: row.highlights ?? [],
    specs: row.specs ?? { material: '', fit: '', care: '' },
    sortOrder: row.sort_order
  };
}

function productToRow(p: Partial<Product>) {
  const row: Record<string, unknown> = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.name !== undefined) row.name = p.name;
  if (p.price !== undefined) row.price = p.price;
  if (p.description !== undefined) row.description = p.description;
  if (p.images !== undefined) row.images = p.images;
  if (p.category !== undefined) row.category = p.category;
  if (p.activities !== undefined) row.activities = p.activities;
  if (p.sizes !== undefined) row.sizes = p.sizes;
  if (p.colors !== undefined) row.colors = p.colors;
  if (p.rating !== undefined) row.rating = p.rating;
  if (p.inStock !== undefined) row.in_stock = p.inStock;
  if (p.highlights !== undefined) row.highlights = p.highlights;
  if (p.specs !== undefined) row.specs = p.specs;
  if (p.sortOrder !== undefined) row.sort_order = p.sortOrder;
  return row;
}

const mapCategory = (row: any): Category => ({ id: row.id, name: row.name, sortOrder: row.sort_order });
const mapActivity = (row: any): Activity => ({ id: row.id, name: row.name, sortOrder: row.sort_order });

const mapPromoTile = (row: any): PromoTile => ({
  id: row.id, title: row.title, subtitle: row.subtitle, image: row.image,
  link: row.link, type: row.type, sortOrder: row.sort_order
});

const mapFaq = (row: any): Faq => ({
  id: row.id, question: row.question, answer: row.answer, sortOrder: row.sort_order
});

const mapPage = (row: any): Page => ({
  slug: row.slug, title: row.title, subtitle: row.subtitle, heading: row.heading,
  sections: row.sections ?? [], images: row.images ?? []
});

const mapSettings = (row: any): Settings => ({
  whatsappNumber: row.whatsapp_number,
  bankName: row.bank_name,
  bankAccountName: row.bank_account_name,
  bankAccountNumber: row.bank_account_number,
  bankBranch: row.bank_branch,
  bankSwiftCode: row.bank_swift_code,
  freeShippingThreshold: Number(row.free_shipping_threshold),
  standardShippingCost: Number(row.standard_shipping_cost),
  expressShippingCost: Number(row.express_shipping_cost),
  taxRate: Number(row.tax_rate)
});

const settingsToRow = (s: Partial<Settings>) => {
  const row: Record<string, unknown> = {};
  if (s.whatsappNumber !== undefined) row.whatsapp_number = s.whatsappNumber;
  if (s.bankName !== undefined) row.bank_name = s.bankName;
  if (s.bankAccountName !== undefined) row.bank_account_name = s.bankAccountName;
  if (s.bankAccountNumber !== undefined) row.bank_account_number = s.bankAccountNumber;
  if (s.bankBranch !== undefined) row.bank_branch = s.bankBranch;
  if (s.bankSwiftCode !== undefined) row.bank_swift_code = s.bankSwiftCode;
  if (s.freeShippingThreshold !== undefined) row.free_shipping_threshold = s.freeShippingThreshold;
  if (s.standardShippingCost !== undefined) row.standard_shipping_cost = s.standardShippingCost;
  if (s.expressShippingCost !== undefined) row.express_shipping_cost = s.expressShippingCost;
  if (s.taxRate !== undefined) row.tax_rate = s.taxRate;
  return row;
};

const mapPromoCode = (row: any): PromoCode => ({ id: row.id, code: row.code, rate: Number(row.rate), active: row.active });

const mapProfile = (row: any): Profile => ({ id: row.id, email: row.email, role: row.role, createdAt: row.created_at });

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

// ============================================================================
// Content bundle — everything SiteContentContext needs, fetched in parallel.
// ============================================================================

export interface SiteContentBundle {
  products: Product[];
  categories: Category[];
  activities: Activity[];
  promoTiles: PromoTile[];
  faqs: Faq[];
  pages: Record<PageSlug, Page>;
  header: HeaderContent;
  footer: FooterContent;
  homeHero: HomeHeroContent;
  settings: Settings;
  promoCodes: PromoCode[];
}

export async function fetchSiteContent(): Promise<SiteContentBundle> {
  const [
    products, categories, activities, promoTiles, faqs, pages, siteContent, settingsRow, promoCodes
  ] = await Promise.all([
    supabase.from('products').select('*').order('sort_order'),
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('activities').select('*').order('sort_order'),
    supabase.from('promo_tiles').select('*').order('sort_order'),
    supabase.from('faqs').select('*').order('sort_order'),
    supabase.from('pages').select('*'),
    supabase.from('site_content').select('*'),
    supabase.from('settings').select('*').eq('id', 1).single(),
    supabase.from('promo_codes').select('*')
  ]);

  const pageRows = unwrap(pages).map(mapPage);
  const pagesBySlug = Object.fromEntries(pageRows.map((p) => [p.slug, p])) as Record<PageSlug, Page>;

  const contentRows = unwrap(siteContent);
  const contentByKey = Object.fromEntries(contentRows.map((r: any) => [r.key, r.value]));

  return {
    products: unwrap(products).map(mapProduct),
    categories: unwrap(categories).map(mapCategory),
    activities: unwrap(activities).map(mapActivity),
    promoTiles: unwrap(promoTiles).map(mapPromoTile),
    faqs: unwrap(faqs).map(mapFaq),
    pages: pagesBySlug,
    header: contentByKey.header as HeaderContent,
    footer: contentByKey.footer as FooterContent,
    homeHero: contentByKey.home_hero as HomeHeroContent,
    settings: mapSettings(unwrap(settingsRow)),
    promoCodes: unwrap(promoCodes).map(mapPromoCode)
  };
}

// ============================================================================
// Products
// ============================================================================

export async function createProduct(product: Product): Promise<Product> {
  const { data, error } = await supabase.from('products').insert(productToRow(product)).select().single();
  return mapProduct(unwrap({ data, error }));
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase.from('products').update(productToRow(patch)).eq('id', id).select().single();
  return mapProduct(unwrap({ data, error }));
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ============================================================================
// Categories / Activities
// ============================================================================

export async function upsertCategory(cat: Category): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .upsert({ id: cat.id, name: cat.name, sort_order: cat.sortOrder })
    .select()
    .single();
  return mapCategory(unwrap({ data, error }));
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function upsertActivity(act: Activity): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .upsert({ id: act.id, name: act.name, sort_order: act.sortOrder })
    .select()
    .single();
  return mapActivity(unwrap({ data, error }));
}

export async function deleteActivity(id: string): Promise<void> {
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ============================================================================
// Promo tiles
// ============================================================================

export async function upsertPromoTile(tile: Partial<PromoTile> & { title: string }): Promise<PromoTile> {
  const row: Record<string, unknown> = {
    title: tile.title, subtitle: tile.subtitle, image: tile.image,
    link: tile.link, type: tile.type, sort_order: tile.sortOrder
  };
  if (tile.id) row.id = tile.id;
  const { data, error } = await supabase.from('promo_tiles').upsert(row).select().single();
  return mapPromoTile(unwrap({ data, error }));
}

export async function deletePromoTile(id: string): Promise<void> {
  const { error } = await supabase.from('promo_tiles').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ============================================================================
// FAQs
// ============================================================================

export async function upsertFaq(faq: Partial<Faq> & { question: string; answer: string }): Promise<Faq> {
  const row: Record<string, unknown> = { question: faq.question, answer: faq.answer, sort_order: faq.sortOrder };
  if (faq.id) row.id = faq.id;
  const { data, error } = await supabase.from('faqs').upsert(row).select().single();
  return mapFaq(unwrap({ data, error }));
}

export async function deleteFaq(id: string): Promise<void> {
  const { error } = await supabase.from('faqs').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ============================================================================
// Static pages (About / Terms / Privacy)
// ============================================================================

export async function updatePage(page: Page): Promise<Page> {
  const { data, error } = await supabase
    .from('pages')
    .update({
      title: page.title, subtitle: page.subtitle, heading: page.heading,
      sections: page.sections, images: page.images
    })
    .eq('slug', page.slug)
    .select()
    .single();
  return mapPage(unwrap({ data, error }));
}

// ============================================================================
// Site content (header / footer / home hero)
// ============================================================================

export async function updateSiteContent(key: 'header' | 'footer' | 'home_hero', value: unknown): Promise<void> {
  const { error } = await supabase.from('site_content').upsert({ key, value });
  if (error) throw new Error(error.message);
}

// ============================================================================
// Settings
// ============================================================================

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  const { data, error } = await supabase.from('settings').update(settingsToRow(patch)).eq('id', 1).select().single();
  return mapSettings(unwrap({ data, error }));
}

// ============================================================================
// Promo codes
// ============================================================================

export async function upsertPromoCode(code: Partial<PromoCode> & { code: string; rate: number }): Promise<PromoCode> {
  const row: Record<string, unknown> = { code: code.code, rate: code.rate, active: code.active ?? true };
  if (code.id) row.id = code.id;
  const { data, error } = await supabase.from('promo_codes').upsert(row).select().single();
  return mapPromoCode(unwrap({ data, error }));
}

export async function deletePromoCode(id: string): Promise<void> {
  const { error } = await supabase.from('promo_codes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ============================================================================
// Orders
// ============================================================================

export interface OrderRow {
  id: string;
  orderNumber: string;
  items: unknown;
  customerInfo: unknown;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'success' | 'failed';
  createdAt: string;
}

const mapOrder = (row: any): OrderRow => ({
  id: row.id, orderNumber: row.order_number, items: row.items, customerInfo: row.customer_info,
  subtotal: Number(row.subtotal), shipping: Number(row.shipping), tax: Number(row.tax), total: Number(row.total),
  paymentMethod: row.payment_method, paymentStatus: row.payment_status, createdAt: row.created_at
});

export async function insertOrder(order: {
  orderNumber: string;
  items: unknown;
  customerInfo: unknown;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'success' | 'failed';
}): Promise<void> {
  const { error } = await supabase.from('orders').insert({
    order_number: order.orderNumber,
    items: order.items,
    customer_info: order.customerInfo,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus
  });
  if (error) throw new Error(error.message);
}

export async function fetchOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return unwrap({ data, error }).map(mapOrder);
}

// ============================================================================
// Staff / profiles
// ============================================================================

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapProfile(data) : null;
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at');
  return unwrap({ data, error }).map(mapProfile);
}

export async function updateProfileRole(id: string, role: StaffRole): Promise<void> {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function removeStaff(id: string): Promise<void> {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ============================================================================
// Storage — image uploads (admin portal)
// ============================================================================

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file, { upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
}
