import React from "react";
import MovieCard from "./MovieCard";
import FeaturedSection from "../FeaturedSection";

const AllActionMovies = ({ dummyActiveShows }) => {
  return (
    <div className="px-6 pt-12  text-white">
      <FeaturedSection headerTitle="Action Movies" />
      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {dummyActiveShows.map((show, index) => (
          <MovieCard key={index} show={show} />
        ))}
      </div>
    </div>
  );
};

export default AllActionMovies;
