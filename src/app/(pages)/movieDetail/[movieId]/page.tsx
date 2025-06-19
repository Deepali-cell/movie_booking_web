"use client";
import ShowMovieDetail from "@/components/ShowMovieDetail";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const movieId = params.movieId as string; // ✅ Fix

  return (
    <div className="pt-20">
      <ShowMovieDetail movieId={movieId} />
    </div>
  );
};

export default Page;
