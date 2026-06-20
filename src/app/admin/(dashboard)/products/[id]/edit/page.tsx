import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#f0e8dc] mb-2">Edit Product</h1>
      <p className="text-sm text-[#8a7d6e] mb-8">{product.name}</p>
      <ProductForm initial={product} onSuccess={() => {}} />
    </div>
  );
}
