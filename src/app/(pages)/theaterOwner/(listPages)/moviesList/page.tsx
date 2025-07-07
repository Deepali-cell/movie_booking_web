"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MovieType, TheaterType } from "@/lib/types";
import MovieCard from "@/components/ownerComponents/cardComponents/MovieCard";
import Loading from "@/components/common/Loading";
import { useStateContext } from "@/context/StateContextProvider";
import { useDeleteMovieMutation, useGetMoviesByTheaterQuery } from "@/app/serveces/movieApi";

const Page = () => {
  const { theaterList } = useStateContext();
  const [selectedTheaterId, setSelectedTheaterId] = useState("");
  const { data, isLoading } = useGetMoviesByTheaterQuery(selectedTheaterId, {
    skip: !selectedTheaterId,
  });
  const [deleteMovie] = useDeleteMovieMutation();
  const router = useRouter();

  const handleDelete = async (movieId: string) => {
    try {
      await deleteMovie(movieId).unwrap();
      toast.success("Deleted movie successfully");
    } catch (err) {
      console.error("❌ Delete failed", err);
      toast.error("Failed to delete movie");
    }
  };

  const handleEdit = (movieId: string) => {
    router.push(`/theaterOwner/editMovie/${movieId}`);
  };

  const movies = data?.movies || [];

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🎬 View Movies by Theater</h1>

      <div className="mb-6 space-x-4">
        {theaterList?.map((theater: TheaterType) => (
          <button
            key={theater._id}
            onClick={() => setSelectedTheaterId(theater._id)}
            className={`px-4 py-2 rounded-full border ${
              selectedTheaterId === theater._id
                ? "bg-white text-black"
                : "bg-transparent text-white border-white"
            }`}
          >
            {theater.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Loading />
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie:MovieType) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onEdit={handleEdit}
              onDelete={() => handleDelete(movie._id)}
            />
          ))}
        </div>
      ) : selectedTheaterId ? (
        <p className="text-gray-400 mt-6">No movies found for this theater.</p>
      ) : (
        <p className="text-gray-500 mt-6">Select a theater to view movies.</p>
      )}
    </div>
  );
};

export default Page;
