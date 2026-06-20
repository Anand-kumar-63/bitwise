import connectDB from "@/lib/mongodb";
import OfferModel from "@/models/Offer";
import { isDbConfigured } from "@/lib/env";
import {
  demoCreateOffer,
  demoDeleteOffer,
  demoGetOfferById,
  demoGetOffers,
  demoUpdateOffer,
} from "@/lib/demo-store";
import { Offer, OfferInput, Product } from "@/types";

function serializeOffer(doc: Record<string, unknown>): Offer {
  return {
    ...doc,
    _id: String(doc._id),
    startsAt: doc.startsAt
      ? new Date(doc.startsAt as string).toISOString()
      : undefined,
    endsAt: doc.endsAt
      ? new Date(doc.endsAt as string).toISOString()
      : undefined,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt as string).toISOString()
      : undefined,
  } as Offer;
}

function isOfferActive(offer: Offer, now = new Date()): boolean {
  if (!offer.isActive) return false;
  if (offer.startsAt && new Date(offer.startsAt) > now) return false;
  if (offer.endsAt && new Date(offer.endsAt) < now) return false;
  return true;
}

export async function queryOffers(activeOnly = false): Promise<Offer[]> {
  let offers: Offer[];

  if (!isDbConfigured()) {
    offers = demoGetOffers();
  } else {
    await connectDB();
    const docs = await OfferModel.find().sort({ createdAt: -1 }).lean();
    offers = docs.map((o) =>
      serializeOffer(o as unknown as Record<string, unknown>)
    );
  }

  return activeOnly ? offers.filter((o) => isOfferActive(o)) : offers;
}

export async function getOfferById(id: string): Promise<Offer | null> {
  if (!isDbConfigured()) {
    return demoGetOfferById(id) ?? null;
  }

  await connectDB();
  const offer = await OfferModel.findById(id).lean();
  return offer ? serializeOffer(offer as unknown as Record<string, unknown>) : null;
}

export async function createOffer(input: OfferInput): Promise<Offer> {
  if (!isDbConfigured()) {
    const offer: Offer = {
      _id: `offer_${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString(),
    };
    return demoCreateOffer(offer);
  }

  await connectDB();
  const created = await OfferModel.create(input);
  return serializeOffer(created.toObject() as unknown as Record<string, unknown>);
}

export async function updateOffer(
  id: string,
  input: Partial<OfferInput>
): Promise<Offer | null> {
  if (!isDbConfigured()) {
    return demoUpdateOffer(id, input);
  }

  await connectDB();
  const updated = await OfferModel.findByIdAndUpdate(id, input, {
    new: true,
  }).lean();
  return updated
    ? serializeOffer(updated as unknown as Record<string, unknown>)
    : null;
}

export async function deleteOffer(id: string): Promise<boolean> {
  if (!isDbConfigured()) {
    return demoDeleteOffer(id);
  }

  await connectDB();
  const result = await OfferModel.findByIdAndDelete(id);
  return Boolean(result);
}

export function offerAppliesToProduct(offer: Offer, product: Product): boolean {
  if (!isOfferActive(offer)) return false;
  if (offer.scope === "sitewide") return true;
  if (offer.scope === "category") return product.category === offer.category;
  if (offer.scope === "product") {
    return offer.productIds?.includes(product._id) ?? false;
  }
  return false;
}

export function applyOffersToProduct(
  product: Product,
  offers: Offer[]
): Product {
  const applicable = offers
    .filter((o) => offerAppliesToProduct(o, product))
    .sort((a, b) => b.discountPercent - a.discountPercent);

  if (!applicable.length) return product;

  const best = applicable[0];
  const originalPrice = product.originalPrice ?? product.price;
  const discounted = Math.round(
    originalPrice * (1 - best.discountPercent / 100)
  );

  return {
    ...product,
    originalPrice,
    price: discounted,
  };
}

export async function getActiveOffers(): Promise<Offer[]> {
  return queryOffers(true);
}
