"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isOwnerRoute = pathname.startsWith("/theaterOwner");

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {!isAdminRoute && !isOwnerRoute && <Navbar />}
      {children}
      {!isAdminRoute && !isOwnerRoute && <Footer />}
    </>
  );
};

export default ClientLayout;
