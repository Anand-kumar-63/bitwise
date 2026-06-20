/**
 * Environment variables — all optional for a demo / test Vercel deploy.
 *
 * When unset, the app uses mock product data and COD checkout (no Razorpay modal).
 * Add these in Vercel → Project → Settings → Environment Variables when ready:
 *
 *   MONGODB_URI                  — MongoDB Atlas connection string
 *   RAZORPAY_KEY_ID              — Razorpay server key (rzp_test_… or rzp_live_…)
 *   RAZORPAY_KEY_SECRET          — Razorpay secret key
 *   NEXT_PUBLIC_RAZORPAY_KEY_ID  — Same as RAZORPAY_KEY_ID (enables checkout modal)
 *   NEXTAUTH_SECRET              — Random string for NextAuth (future use)
 *   NEXTAUTH_URL                   — e.g. https://your-app.vercel.app
 *   NEXT_PUBLIC_BASE_URL           — Public site URL (auto-detects VERCEL_URL if omitted)
 *   ADMIN_PASSWORD                 — Admin panel login password (default: admin123 for demo)
 *   ADMIN_SESSION_SECRET           — Signs admin session cookies (falls back to NEXTAUTH_SECRET)
 */

export const env = {
  // process.env.MONGODB_URI
  mongodbUri: process.env.MONGODB_URI ?? "",

  // process.env.RAZORPAY_KEY_ID
  razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? "",

  // process.env.RAZORPAY_KEY_SECRET
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ?? "",

  // process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  publicRazorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",

  // process.env.NEXTAUTH_SECRET
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? "",

  // process.env.NEXTAUTH_URL
  nextAuthUrl: process.env.NEXTAUTH_URL ?? "",

  // process.env.NEXT_PUBLIC_BASE_URL
  publicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "",

  // process.env.ADMIN_PASSWORD
  adminPassword: process.env.ADMIN_PASSWORD ?? "admin123",

  // process.env.ADMIN_SESSION_SECRET
  adminSessionSecret:
    process.env.ADMIN_SESSION_SECRET ?? process.env.NEXTAUTH_SECRET ?? "demo-admin-secret",
} as const;

export function isDbConfigured(): boolean {
  return Boolean(env.mongodbUri);
}

export function isRazorpayConfigured(): boolean {
  return Boolean(env.razorpayKeyId && env.razorpayKeySecret);
}

export function isPublicRazorpayConfigured(): boolean {
  return Boolean(env.publicRazorpayKeyId);
}

/** Site URL for server-side fetches (Vercel sets VERCEL_URL automatically). */
export function getBaseUrl(): string {
  if (env.publicBaseUrl) return env.publicBaseUrl.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
