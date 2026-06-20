import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { isDbConfigured } from "@/lib/env";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Product as ProductType } from "@/types";

export interface ProductQuery {
  category?: string | null;
  limit?: number;
  page?: number;
  featured?: boolean;
  bridal?: boolean;
  sale?: boolean;
  q?: string | null;
}

function filterMockProducts(query: ProductQuery): ProductType[] {
  let products = [...MOCK_PRODUCTS];

  if (query.category) {
    products = products.filter((p) => p.category === query.category);
  }
  if (query.featured) {
    products = products.filter((p) => p.isBestseller);
  }
  if (query.bridal) {
    products = products.filter((p) => p.isBridal);
  }
  if (query.sale) {
    products = products.filter((p) => p.originalPrice != null);
  }
  if (query.q) {
    const q = query.q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  return products;
}

export async function queryProducts(query: ProductQuery = {}) {
  const limit = query.limit ?? 20;
  const page = query.page ?? 1;

  if (!isDbConfigured()) {
    const all = filterMockProducts(query);
    const skip = (page - 1) * limit;
    const products = all.slice(skip, skip + limit);

    return {
      products,
      total: all.length,
      page,
      pages: Math.max(1, Math.ceil(all.length / limit)),
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
  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products: products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    })),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(
  slug: string
): Promise<ProductType | null> {
  if (!isDbConfigured()) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  await connectDB();
  const product = await Product.findOne({ slug }).lean();
  if (!product) return null;

  return {
    ...product,
    _id: product._id.toString(),
  } as ProductType;
}
