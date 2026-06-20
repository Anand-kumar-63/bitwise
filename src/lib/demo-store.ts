import { Offer, Product } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export const MOCK_OFFERS: Offer[] = [
  {
    _id: "offer-1",
    title: "Bridal Season Sale",
    description: "Celebrate your big day with 15% off all bridal lehengas.",
    bannerText: "Bridal Season — 15% Off Lehengas",
    code: "BRIDAL15",
    discountPercent: 15,
    scope: "category",
    category: "lehenga",
    isActive: true,
  },
  {
    _id: "offer-2",
    title: "Festive Edit",
    description: "Flat 10% off across the entire store this festive season.",
    bannerText: "Festive Edit — 10% Off Sitewide",
    code: "FESTIVE10",
    discountPercent: 10,
    scope: "sitewide",
    isActive: true,
  },
];

interface DemoStore {
  products: Product[];
  offers: Offer[];
}

declare global {
  // eslint-disable-next-line no-var
  var taaniaDemoStore: DemoStore | undefined;
}

function getStore(): DemoStore {
  if (!global.taaniaDemoStore) {
    global.taaniaDemoStore = {
      products: MOCK_PRODUCTS.map((p) => ({ ...p })),
      offers: MOCK_OFFERS.map((o) => ({ ...o })),
    };
  }
  return global.taaniaDemoStore;
}

export function demoGetProducts(): Product[] {
  return getStore().products;
}

export function demoGetProductById(id: string): Product | undefined {
  return getStore().products.find((p) => p._id === id);
}

export function demoGetProductBySlug(slug: string): Product | undefined {
  return getStore().products.find((p) => p.slug === slug);
}

export function demoCreateProduct(product: Product): Product {
  getStore().products.unshift(product);
  return product;
}

export function demoUpdateProduct(
  id: string,
  updates: Partial<Product>
): Product | null {
  const index = getStore().products.findIndex((p) => p._id === id);
  if (index === -1) return null;
  getStore().products[index] = { ...getStore().products[index], ...updates };
  return getStore().products[index];
}

export function demoDeleteProduct(id: string): boolean {
  const index = getStore().products.findIndex((p) => p._id === id);
  if (index === -1) return false;
  getStore().products.splice(index, 1);
  return true;
}

export function demoGetOffers(): Offer[] {
  return getStore().offers;
}

export function demoGetOfferById(id: string): Offer | undefined {
  return getStore().offers.find((o) => o._id === id);
}

export function demoCreateOffer(offer: Offer): Offer {
  getStore().offers.unshift(offer);
  return offer;
}

export function demoUpdateOffer(
  id: string,
  updates: Partial<Offer>
): Offer | null {
  const index = getStore().offers.findIndex((o) => o._id === id);
  if (index === -1) return null;
  getStore().offers[index] = { ...getStore().offers[index], ...updates };
  return getStore().offers[index];
}

export function demoDeleteOffer(id: string): boolean {
  const index = getStore().offers.findIndex((o) => o._id === id);
  if (index === -1) return false;
  getStore().offers.splice(index, 1);
  return true;
}
