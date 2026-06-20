import { notFound } from "next/navigation";
import OfferForm from "@/components/admin/OfferForm";
import { getOfferById } from "@/lib/offers";

export default async function EditOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOfferById(id);
  if (!offer) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#f0e8dc] mb-2">Edit Offer</h1>
      <p className="text-sm text-[#8a7d6e] mb-8">{offer.title}</p>
      <OfferForm initial={offer} />
    </div>
  );
}
