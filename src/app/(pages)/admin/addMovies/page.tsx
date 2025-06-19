import AddMovie from "@/components/adminComponents/AddMovie";
import AdminFeaturedSection from "@/components/adminComponents/AdminFeaturedSection";
import React from "react";

const Page = () => {
  return (
    <div>
      <AdminFeaturedSection headerTitle="Add New Movies" />
      <AddMovie />
    </div>
  );
};

export default Page;
