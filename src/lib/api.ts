import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, Timestamp, type DocumentData, type QueryDocumentSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type {
  Product, Category, Activity, PromoTile, Faq, Page, PageSlug,
  HeaderContent, FooterContent, HomeHeroContent, Settings, PromoCode, Profile, StaffRole
} from '../types';

// ============================================================================
// Doc → app-type helpers. Firestore stores plain camelCase JSON, so (unlike a
// SQL row) most types need no field-by-field mapping — just attach the doc id.
// ============================================================================

function withId<T>(snap: QueryDocumentSnapshot<DocumentData>): T {
  return { id: snap.id, ...snap.data() } as T;
}

function timestampToIso(value: unknown): string {
  return value instanceof Timestamp ? value.toDate().toISOString() : new Date().toISOString();
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

const sorted = (name: string) => query(collection(db, name), orderBy('sortOrder'));

export async function fetchSiteContent(): Promise<SiteContentBundle> {
  const [
    products, categories, activities, promoTiles, faqs, pages, siteContent, settingsDoc, promoCodes
  ] = await Promise.all([
    getDocs(sorted('products')),
    getDocs(sorted('categories')),
    getDocs(sorted('activities')),
    getDocs(sorted('promoTiles')),
    getDocs(sorted('faqs')),
    getDocs(collection(db, 'pages')),
    getDocs(collection(db, 'siteContent')),
    getDoc(doc(db, 'settings', 'main')),
    getDocs(collection(db, 'promoCodes'))
  ]);

  const pagesBySlug = Object.fromEntries(
    pages.docs.map((d) => [d.id, { slug: d.id, ...d.data() } as Page])
  ) as Record<PageSlug, Page>;

  const contentByKey = Object.fromEntries(
    siteContent.docs.map((d) => [d.id, d.data().value])
  );

  if (!settingsDoc.exists()) throw new Error('Firestore document settings/main is missing — run the seed script.');

  return {
    products: products.docs.map((d) => withId<Product>(d)),
    categories: categories.docs.map((d) => withId<Category>(d)),
    activities: activities.docs.map((d) => withId<Activity>(d)),
    promoTiles: promoTiles.docs.map((d) => withId<PromoTile>(d)),
    faqs: faqs.docs.map((d) => withId<Faq>(d)),
    pages: pagesBySlug,
    header: contentByKey.header as HeaderContent,
    footer: contentByKey.footer as FooterContent,
    homeHero: contentByKey.home_hero as HomeHeroContent,
    settings: settingsDoc.data() as Settings,
    promoCodes: promoCodes.docs.map((d) => withId<PromoCode>(d))
  };
}

// ============================================================================
// Products
// ============================================================================

export async function createProduct(product: Product): Promise<Product> {
  const { id, ...data } = product;
  await setDoc(doc(db, 'products', id), data);
  return product;
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product> {
  const { id: _ignored, ...data } = patch;
  await updateDoc(doc(db, 'products', id), data);
  const snap = await getDoc(doc(db, 'products', id));
  return { id: snap.id, ...snap.data() } as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

// ============================================================================
// Categories / Activities
// ============================================================================

export async function upsertCategory(cat: Category): Promise<Category> {
  const { id, ...data } = cat;
  await setDoc(doc(db, 'categories', id), data, { merge: true });
  return cat;
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, 'categories', id));
}

export async function upsertActivity(act: Activity): Promise<Activity> {
  const { id, ...data } = act;
  await setDoc(doc(db, 'activities', id), data, { merge: true });
  return act;
}

export async function deleteActivity(id: string): Promise<void> {
  await deleteDoc(doc(db, 'activities', id));
}

// ============================================================================
// Promo tiles
// ============================================================================

export async function upsertPromoTile(tile: Partial<PromoTile> & { title: string }): Promise<PromoTile> {
  const { id, ...data } = tile;
  if (id) {
    await setDoc(doc(db, 'promoTiles', id), data, { merge: true });
    return { id, ...data } as PromoTile;
  }
  const ref = await addDoc(collection(db, 'promoTiles'), data);
  return { id: ref.id, ...data } as PromoTile;
}

export async function deletePromoTile(id: string): Promise<void> {
  await deleteDoc(doc(db, 'promoTiles', id));
}

// ============================================================================
// FAQs
// ============================================================================

export async function upsertFaq(faq: Partial<Faq> & { question: string; answer: string }): Promise<Faq> {
  const { id, ...data } = faq;
  if (id) {
    await setDoc(doc(db, 'faqs', id), data, { merge: true });
    return { id, ...data } as Faq;
  }
  const ref = await addDoc(collection(db, 'faqs'), data);
  return { id: ref.id, ...data } as Faq;
}

export async function deleteFaq(id: string): Promise<void> {
  await deleteDoc(doc(db, 'faqs', id));
}

// ============================================================================
// Static pages (About / Terms / Privacy)
// ============================================================================

export async function updatePage(page: Page): Promise<Page> {
  const { slug, ...data } = page;
  await setDoc(doc(db, 'pages', slug), data, { merge: true });
  return page;
}

// ============================================================================
// Site content (header / footer / home hero)
// ============================================================================

export async function updateSiteContent(key: 'header' | 'footer' | 'home_hero', value: unknown): Promise<void> {
  await setDoc(doc(db, 'siteContent', key), { value, updatedAt: serverTimestamp() }, { merge: true });
}

// ============================================================================
// Settings
// ============================================================================

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  await setDoc(doc(db, 'settings', 'main'), patch, { merge: true });
  const snap = await getDoc(doc(db, 'settings', 'main'));
  return snap.data() as Settings;
}

// ============================================================================
// Promo codes
// ============================================================================

export async function upsertPromoCode(code: Partial<PromoCode> & { code: string; rate: number }): Promise<PromoCode> {
  const { id, ...data } = code;
  const row = { active: true, ...data };
  if (id) {
    await setDoc(doc(db, 'promoCodes', id), row, { merge: true });
    return { id, ...row } as PromoCode;
  }
  const ref = await addDoc(collection(db, 'promoCodes'), row);
  return { id: ref.id, ...row } as PromoCode;
}

export async function deletePromoCode(id: string): Promise<void> {
  await deleteDoc(doc(db, 'promoCodes', id));
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
  await addDoc(collection(db, 'orders'), { ...order, createdAt: serverTimestamp() });
}

export async function fetchOrders(): Promise<OrderRow[]> {
  const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      orderNumber: data.orderNumber,
      items: data.items,
      customerInfo: data.customerInfo,
      subtotal: Number(data.subtotal),
      shipping: Number(data.shipping),
      tax: Number(data.tax),
      total: Number(data.total),
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      createdAt: timestampToIso(data.createdAt)
    };
  });
}

// ============================================================================
// Staff / profiles
// ============================================================================

function mapProfile(id: string, data: DocumentData): Profile {
  return { id, email: data.email, role: data.role, createdAt: timestampToIso(data.createdAt) };
}

// Creates profiles/{uid} the first time a staff member signs in. Always
// defaults to 'editor' — matches Firestore rules, which only allow a user to
// create their own profile doc with role 'editor' (self-promotion to admin is
// blocked; see firebase/README.md for promoting the first admin by hand).
export async function ensureProfile(uid: string, email: string | null): Promise<void> {
  const ref = doc(db, 'profiles', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { email: email ?? '', role: 'editor', createdAt: serverTimestamp() });
  }
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const snap = await getDoc(doc(db, 'profiles', userId));
  return snap.exists() ? mapProfile(snap.id, snap.data()) : null;
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  const snap = await getDocs(query(collection(db, 'profiles'), orderBy('createdAt')));
  return snap.docs.map((d) => mapProfile(d.id, d.data()));
}

export async function updateProfileRole(id: string, role: StaffRole): Promise<void> {
  await updateDoc(doc(db, 'profiles', id), { role });
}

export async function removeStaff(id: string): Promise<void> {
  await deleteDoc(doc(db, 'profiles', id));
}

// ============================================================================
// Storage — image uploads (admin portal)
// ============================================================================

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `media/${folder}/${crypto.randomUUID()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}
