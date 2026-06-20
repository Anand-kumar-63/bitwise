import OfferForm from "@/components/admin/OfferForm";

export default function NewOfferPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#f0e8dc] mb-2">Create Offer</h1>
      <p className="text-sm text-[#8a7d6e] mb-8">
        Set up a discount that appears on the website and adjusts product prices.
      </p>
      <OfferForm />
    </div>
  );
}
