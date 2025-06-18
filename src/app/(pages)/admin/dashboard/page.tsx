import { dummyDashboardData } from "@/assets/assets";
import AdminFeaturedSection from "@/components/adminComponents/AdminFeaturedSection";
import Card from "@/components/adminComponents/Card";
import React from "react";
import { UsersRound, BarChart3, TicketCheck, Film } from "lucide-react";
import AllActionMovies from "@/components/adminComponents/AllActionMovies";

const page = () => {
  const data = [
    {
      title: "Total Bookings",
      range: dummyDashboardData.totalBookings,
      icon: <TicketCheck className="w-10 h-10" />,
    },
    {
      title: "Total Revenue",
      range: `₹${dummyDashboardData.totalRevenue}`,
      icon: <BarChart3 className="w-10 h-10" />,
    },
    {
      title: "Total Users",
      range: dummyDashboardData.totalUser,
      icon: <UsersRound className="w-10 h-10" />,
    },
    {
      title: "Active Shows",
      range: dummyDashboardData.activeShows.length,
      icon: <Film className="w-10 h-10" />,
    },
  ];

  return (
    <div className="px-4 sm:px-10 pt-4">
      <AdminFeaturedSection headerTitle="Admin Dashboard" />
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((d, index) => (
          <Card data={d} icon={d.icon} key={index} />
        ))}
      </div>
      <AllActionMovies dummyActiveShows={dummyDashboardData.activeShows} />
    </div>
  );
};

export default page;
