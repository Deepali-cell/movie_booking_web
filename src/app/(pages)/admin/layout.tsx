import SideBar from "@/components/common/SideBar";
import React from "react";
import {
  LayoutDashboard,
  PlusSquare,
  ListOrdered,
  ClipboardList,
  Home,
  User,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    { label: "Home", href: "/", icon: <Home size={20} /> },

    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      icon: <PlusSquare size={20} />,
      label: "Theaters List",
      href: "/admin/theatersList",
    },
    {
      icon: <ListOrdered size={20} />,
      label: "Owners List",
      href: "/admin/ownersList",
    },
    {
      icon: <ClipboardList size={20} />,
      label: "Shows List",
      href: "/admin/showsList",
    },
    {
      icon: <User size={20} />,
      label: "Users List",
      href: "/admin/usersList",
    },
    {
      label: "Bookings List",
      href: "/admin/bookingsList",
      icon: <ClipboardList size={20} />,
    },
  ];
  return (
    <div className="flex min-h-screen">
      <SideBar sidebarItems={sidebarItems} />
      <div className="flex-1 p-4 text-white">{children}</div>
    </div>
  );
}
