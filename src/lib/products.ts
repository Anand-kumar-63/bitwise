import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { isDbConfigured } from "@/lib/env";
import {
  demoCreateProduct,
  demoDeleteProduct,
  demoGetProductById,
  demoGetProductBySlug,
  demoGetProducts,
  demoUpdateProduct,
} from "@/lib/demo-store";
import { applyOffersToProduct, getActiveOffers } from "@/lib/offers";
import { Product as ProductType, ProductInput } from "@/types";
import { slugify } from "@/lib/utils";

export interface ProductQuery {
  category?: string | null;
  limit?: number;
  page?: number;
  featured?: boolean;
  bridal?: boolean;
  sale?: boolean;
  q?: string | null;
  applyOffers?: boolean;
}

function serializeProduct(doc: Record<string, unknown>): ProductType {
  return {
    ...doc,
    _id: String(doc._id),
    createdAt: doc.createdAt
      ? new Date(doc.createdAt as string).toISOString()
      : undefined,
  } as ProductType;
}

function filterProducts(products: ProductType[], query: ProductQuery): ProductType[] {
  let result = [...products];

  if (query.category) {
    result = result.filter((p) => p.category === query.category);
  }
  if (query.featured) {
    result = result.filter((p) => p.isBestseller);
  }
  if (query.bridal) {
    result = result.filter((p) => p.isBridal);
  }
  if (query.sale) {
    result = result.filter((p) => p.originalPrice != null);
  }
  if (query.q) {
    const q = query.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  return result;
}

async function maybeApplyOffers(
  products: ProductType[],
  applyOffers = true
): Promise<ProductType[]> {
  if (!applyOffers) return products;
  const offers = await getActiveOffers();
  if (!offers.length) return products;
  return products.map((p) => applyOffersToProduct(p, offers));
}

export async function queryProducts(query: ProductQuery = {}) {
  const limit = query.limit ?? 20;
  const page = query.page ?? 1;
  const applyOffers = query.applyOffers ?? true;

  if (!isDbConfigured()) {
    const all = filterProducts(demoGetProducts(), query);
    const withOffers = await maybeApplyOffers(all, applyOffers);
    const skip = (page - 1) * limit;
    const products = withOffers.slice(skip, skip + limit);

    return {
      products,
      total: withOffers.length,
      page,
      pages: Math.max(1, Math.ceil(withOffers.length / limit)),
    };
  }

  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (query.category) filter.category = query.category;
  if (query.featured) filter.isBestseller = true;
  if (query.bridal) filter.isBridal = true;
  if (query.sale) filter.originalPrice = { $exists: true };
  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: "i" } },
      { tags: { $regex: query.q, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  const products = docs.map((p) =>
    serializeProduct(p as unknown as Record<string, unknown>)
  );
  const withOffers = await maybeApplyOffers(products, applyOffers);

  return {
    products: withOffers,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(
  slug: string,
  applyOffers = true
): Promise<ProductType | null> {
  let product: ProductType | null = null;

  if (!isDbConfigured()) {
    product = demoGetProductBySlug(slug) ?? null;
  } else {
    await connectDB();
    const doc = await Product.findOne({ slug }).lean();
    product = doc ? serializeProduct(doc as unknown as Record<string, unknown>) : null;
  }

  if (!product) return null;
  if (!applyOffers) return product;

  const offers = await getActiveOffers();
  return applyOffersToProduct(product, offers);
}

export async function getProductById(id: string): Promise<ProductType | null> {
  if (!isDbConfigured()) {
    return demoGetProductById(id) ?? null;
  }

  await connectDB();
  const doc = await Product.findById(id).lean();
  return doc ? serializeProduct(doc as unknown as Record<string, unknown>) : null;
}

export async function listAllProducts(): Promise<ProductType[]> {
  if (!isDbConfigured()) {
    return demoGetProducts();
  }

  await connectDB();
  const docs = await Product.find().sort({ createdAt: -1 }).lean();
  return docs.map((p) => serializeProduct(p as unknown as Record<string, unknown>));
}

export async function createProduct(input: ProductInput): Promise<ProductType> {
  const slug = input.slug?.trim() || slugify(input.name);
  const payload = { ...input, slug };

  if (!isDbConfigured()) {
    const product: ProductType = {
      _id: `prod_${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    return demoCreateProduct(product);
  }

  await connectDB();
  const created = await Product.create(payload);
  return serializeProduct(created.toObject() as unknown as Record<string, unknown>);
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<ProductType | null> {
  const payload = { ...input };
  if (payload.name && !payload.slug) {
    payload.slug = slugify(payload.name);
  }

  if (!isDbConfigured()) {
    return demoUpdateProduct(id, payload);
  }

  await connectDB();
  const updated = await Product.findByIdAndUpdate(id, payload, {
    new: true,
  }).lean();
  return updated ? serializeProduct(updated as unknown as Record<string, unknown>) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!isDbConfigured()) {
    return demoDeleteProduct(id);
  }

  await connectDB();
  const result = await Product.findByIdAndDelete(id);
  return Boolean(result);
}
