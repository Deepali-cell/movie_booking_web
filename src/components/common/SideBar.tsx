"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

type SidebarItemType = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const SideBar = ({ sidebarItems }: { sidebarItems: SidebarItemType[] }) => {
  return (
    <div className="min-h-screen w-64 border-r border-amber-50 text-white flex flex-col p-4 shadow-xl bg-black">
      {/* Navigation Items */}
      <nav className="flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
          />
        ))}
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
