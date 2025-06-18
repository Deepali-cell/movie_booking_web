import AddMovie from "@/components/adminComponents/AddMovie";
import AdminFeaturedSection from "@/components/adminComponents/AdminFeaturedSection";
import React from "react";

const page = () => {
  return (
    <div>
      <AdminFeaturedSection headerTitle="Add New Movies" />
      <AddMovie />
    </div>
  );
};

export default page;
