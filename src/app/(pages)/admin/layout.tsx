import SideBar from "@/components/adminComponents/SideBar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1 p-4 text-white">{children}</div>
    </div>
  );
}
