import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#f0e8dc] mb-2">Add Product</h1>
      <p className="text-sm text-[#8a7d6e] mb-8">
        Create a new listing for the storefront.
      </p>
      <ProductForm onSuccess={() => {}} />
    </div>
  );
}
