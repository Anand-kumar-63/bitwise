import { Toaster } from "react-hot-toast";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}
