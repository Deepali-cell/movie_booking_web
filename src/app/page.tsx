import React from "react";
import AllMovies from "@/components/AllMovies";
import AllTrailors from "@/components/AllTrailors";
import HeroSection from "@/components/HeroSection";
import { dummyShowsData } from "@/assets/assets";
import FeaturedSection from "@/components/FeaturedSection";

const Page = () => {
  const dummyData = dummyShowsData.slice(0, 3);
  return (
    <>
      <HeroSection />
      {/* Section Header */}
      <FeaturedSection
        headerTitle={"Now Showing"}
        feature={"View All"}
        navigateTo="movies"
      />
      <AllMovies dummyShowsData={dummyData} showMore={true} />
      <AllTrailors />
    </>
  );
};

export default Page;
