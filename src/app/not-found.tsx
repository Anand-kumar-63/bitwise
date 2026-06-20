import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Taania Kandpal",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0806] flex items-center justify-center px-6 text-center">
      <div className="max-w-[480px]">
        <div className="font-serif text-[6rem] text-[#c9a84c]/20 leading-none mb-4">404</div>
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-12 bg-[#c9a84c]/40" />
          <span className="text-[0.65rem] tracking-[0.28em] uppercase text-[#c9a84c]">Not Found</span>
          <div className="h-px w-12 bg-[#c9a84c]/40" />
        </div>
        <h1 className="font-serif text-[2rem] font-medium text-[#f0e8dc] mb-4">
          This Page Does Not Exist
        </h1>
        <p className="text-[#8a7d6e] text-sm leading-relaxed mb-8">
          The page you are looking for may have been moved, deleted, or might never have existed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0806] px-8 py-3.5 text-[0.78rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
