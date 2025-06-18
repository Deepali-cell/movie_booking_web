import AllMovies from "@/components/AllMovies";
import React from "react";
import { dummyShowsData } from "@/assets/assets";
import FeaturedSection from "@/components/FeaturedSection";

const page = () => {
  return (
    <div className="pt-20">
      {/* Section Header */}
      <FeaturedSection
        headerTitle={"Now Showing"}
        feature={"View All"}
        navigateTo="movies"
      />
      <AllMovies dummyShowsData={dummyShowsData} showMore={false} />
    </div>
  );
};

export default page;
