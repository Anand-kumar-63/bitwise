import Link from "next/link";
import { Tag } from "lucide-react";
import { getActiveOffers } from "@/lib/offers";

export default async function OffersBanner() {
  const offers = await getActiveOffers();
  if (!offers.length) return null;

  return (
    <section className="bg-[#110e0a] border-y border-[#c9a84c]/12 py-10 px-6">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Tag size={16} className="text-[#c9a84c]" />
          <span className="text-[0.68rem] tracking-[0.22em] uppercase text-[#c9a84c] font-semibold">
            Current Offers
          </span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="border border-[#c9a84c]/15 bg-[#0a0806]/60 p-5 flex flex-col"
            >
              <div className="text-[0.62rem] uppercase tracking-[0.15em] text-[#c4405a] font-bold mb-2">
                {offer.discountPercent}% Off
              </div>
              <h3 className="font-serif text-lg text-[#f0e8dc] mb-2">
                {offer.bannerText}
              </h3>
              <p className="text-sm text-[#8a7d6e] flex-1">{offer.description}</p>
              {offer.code && (
                <div className="mt-4 text-[0.72rem] text-[#c9a84c] tracking-wider">
                  Use code: <span className="font-semibold">{offer.code}</span>
                </div>
              )}
              <Link
                href={
                  offer.scope === "category" && offer.category
                    ? `/shop?category=${offer.category}`
                    : "/shop?sale=true"
                }
                className="mt-4 inline-block text-[0.68rem] uppercase tracking-[0.12em] text-[#c9a84c] hover:underline"
              >
                Shop this offer →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
