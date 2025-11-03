"use client";
import SideBar from "@/components/common/SideBar";
import React, { useState } from "react";
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
  const [open, setOpen] = useState(false);
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
      {/* ✅ Mobile Hamburger */}
      <button
        className="md:hidden p-3 text-white bg-black fixed top-4 left-4 rounded-lg z-50"
        onClick={() => setOpen(true)}
      >
        ☰
      </button>

      {/* ✅ Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#111] transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-40 md:hidden`}
      >
        <div className="p-4 text-right">
          <button onClick={() => setOpen(false)} className="text-white text-xl">
            ✕
          </button>
        </div>

        <SideBar sidebarItems={sidebarItems} />
      </div>

      {/* ✅ Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-[#111]">
        <SideBar sidebarItems={sidebarItems} />
      </div>

      {/* ✅ Content */}
      <div className="flex-1 p-4 text-white">{children}</div>
    </div>
  );
}
