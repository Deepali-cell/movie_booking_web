"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");
  const isOwnerRoute = pathname.startsWith("/theaterOwner");
  const isRoleCheckPage = pathname === "/roleCheck";
  const isJoinGroupPage = pathname.startsWith("/joinGroup/");

  const showLayout = !isAdminRoute && !isOwnerRoute && !isRoleCheckPage;
  const showFooter = showLayout && !isJoinGroupPage;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {showLayout && <Navbar />}
      {children}
      {showFooter && <Footer />}
    </>
  );
};

export default ClientLayout;
