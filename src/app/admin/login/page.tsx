import { Suspense } from "react";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0806] flex items-center justify-center text-[#8a7d6e] text-sm">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
