"use client";
import MoviesSection from "@/components/common/sections/MovieSection";
import { useStateContext } from "@/context/StateContextProvider";
import { useEffect } from "react";

const Page = () => {
  const { fetchallMovies, allmovies } = useStateContext();

  useEffect(() => {
    fetchallMovies();
  }, [fetchallMovies]);

  return (
    <div className="pt-20 px-10">
      <MoviesSection movies={allmovies} />
    </div>
  );
};

export default Page;
