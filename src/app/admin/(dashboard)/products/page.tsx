"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;

    const res = await fetch(`/api/admin/products?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Product deleted");
      load();
    } else {
      toast.error(data.error ?? "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#f0e8dc] mb-1">Products</h1>
          <p className="text-sm text-[#8a7d6e]">{products.length} items in catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0806] px-5 py-2.5 text-[0.72rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a]"
        >
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-[#8a7d6e] text-sm">Loading…</p>
      ) : (
        <div className="border border-[#c9a84c]/12 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#110e0a] text-[#6b6258] text-[0.65rem] uppercase tracking-wider">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-[#c9a84c]/10">
                  <td className="p-4 text-[#f0e8dc]">{p.name}</td>
                  <td className="p-4 text-[#8a7d6e] capitalize">{p.category}</td>
                  <td className="p-4 text-[#c9a84c]">{formatPrice(p.price)}</td>
                  <td className="p-4 text-[#8a7d6e]">{p.stock}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${p._id}/edit`}
                        className="p-2 text-[#8a7d6e] hover:text-[#c9a84c] border border-[#c9a84c]/15"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="p-2 text-[#8a7d6e] hover:text-[#c4405a] border border-[#c9a84c]/15"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
