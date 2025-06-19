"use client";
import React from "react";
import SingleMovieCard from "./SingleMovieCard";
import { useRouter } from "next/navigation";
import { Movie } from "@/lib/types";

type AllMoviesProps = {
  dummyShowsData: Movie[];
  showMore?: boolean;
};

const AllMovies: React.FC<AllMoviesProps> = ({
  dummyShowsData,
  showMore = false,
}) => {
  const navigate = useRouter();
  return (
    <div className="px-6 py-12 bg-black text-white">
      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {dummyShowsData.map((movie, index) => (
          <SingleMovieCard key={index} movie={movie} />
        ))}
      </div>
      <div className="flex justify-center items-center py-4 pt-8">
        {showMore && (
          <button
            onClick={() => navigate.push("/movies")}
            className="bg-red-500 text-white px-4 py-1.5 rounded-full hover:bg-red-600 transition flex items-center gap-2 text-sm"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default AllMovies;
