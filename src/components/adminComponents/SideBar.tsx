"use client";

import Link from "next/link";
import React from "react";
import {
  LayoutDashboard,
  PlusSquare,
  ListOrdered,
  ClipboardList,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SideBar = () => {
  return (
    <div className="min-h-screen w-64 border-r border-amber-50 text-white flex flex-col p-4 shadow-xl ">
      {/* Admin Info */}
      <div className="flex items-center gap-3 mb-10">
        <Image
          src="https://i.pravatar.cc/100?img=67"
          alt="Admin"
          height={50}
          width={50}
          className="rounded-full border-2 border-yellow-400"
        />
        <div>
          <p className="font-semibold text-lg">Admin</p>
          <p className="text-xs text-gray-400">admin@example.com</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-2">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          href="/admin/dashboard"
        />
        <SidebarItem
          icon={<PlusSquare size={20} />}
          label="Add Shows"
          href="/admin/addMovies"
        />
        <SidebarItem
          icon={<ListOrdered size={20} />}
          label="List Shows"
          href="/admin/moviesList"
        />
        <SidebarItem
          icon={<ClipboardList size={20} />}
          label="List Bookings"
          href="/admin/allBookings"
        />
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-white/10 text-center text-xs text-gray-400">
        &copy; 2025 MovieApp Admin
      </div>
    </div>
  );
};

const SidebarItem = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all
        ${isActive ? "bg-yellow-500/20 text-yellow-400" : "hover:bg-white/10"}
        `}
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default SideBar;
