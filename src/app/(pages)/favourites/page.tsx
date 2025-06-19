import { dummyShowsData } from "@/assets/assets";
import AllMovies from "@/components/AllMovies";
import FeaturedSection from "@/components/FeaturedSection";
import React from "react";

const Page = () => {
  return (
    <div className="pt-20">
      <FeaturedSection headerTitle="My favorites List" />
      <AllMovies dummyShowsData={dummyShowsData} />
    </div>
  );
};

export default Page;
