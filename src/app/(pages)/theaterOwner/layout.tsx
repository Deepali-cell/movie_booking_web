import SideBar from "@/components/common/SideBar";
import React from "react";
import {
  LayoutDashboard,
  ListOrdered,
  Film,
  TicketPlus,
  Building2,
  CalendarClock,
  ClipboardList,
  Home,
  Video,
} from "lucide-react";
import { GiFoodTruck } from "react-icons/gi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Step 1: Sidebar Items Array
  const sidebarItems = [
    { label: "Home", href: "/", icon: <Home size={20} /> },

    {
      label: "Add Theater",
      href: "/theaterOwner/addTheater",
      icon: <Building2 size={20} />,
    },
    {
      label: "Add Block",
      href: "/theaterOwner/addBlock",
      icon: <TicketPlus size={20} />,
    },
    {
      label: "Add Movie",
      href: "/theaterOwner/addMovie",
      icon: <Film size={20} />,
    },
    {
      label: "Add Show",
      href: "/theaterOwner/addShow",
      icon: <TicketPlus size={20} />,
    },
    {
      label: "Add FoodCourt",
      href: "/theaterOwner/addFoodCourt",
      icon: <GiFoodTruck size={20} />,
    },
    {
      label: "Add New Short",
      href: "/theaterOwner/addNewShorts",
      icon: <Video size={20} />,
    },
    {
      label: "Add New item to the foodCourt",
      href: "/theaterOwner/addItemToFoodCourt",
      icon: <GiFoodTruck size={20} />,
    },
    {
      label: "Movies List",
      href: "/theaterOwner/moviesList",
      icon: <ListOrdered size={20} />,
    },

    {
      label: "Theaters List",
      href: "/theaterOwner/theatersList",
      icon: <ClipboardList size={20} />,
    },
    {
      label: "Shows List",
      href: "/theaterOwner/showsList",
      icon: <CalendarClock size={20} />,
    },
    {
      label: "Food Court List",
      href: "/theaterOwner/foodCourtList",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Bookings List",
      href: "/theaterOwner/bookingsList",
      icon: <ClipboardList size={20} />,
    },
    {
      label: "Food Orders",
      href: "/theaterOwner/foodOrderList",
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
