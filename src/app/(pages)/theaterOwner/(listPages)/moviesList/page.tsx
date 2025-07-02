"use client";
import Loading from "@/components/common/Loading";
import MovieCard from "@/components/ownerComponents/cardComponents/MovieCard";
import { useStateContext } from "@/context/StateContextProvider";
import { TheaterType } from "@/lib/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { theaterList, selectedTheaterId, fetchMovies, movies } =
    useStateContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const deleteMovie = async (movieId: string) => {
    try {
      const res = await axios.delete(
        `/api/owner/deleteMovie?movieId=${movieId}`
      );
      if (res.data.success) {
        toast.success(res.data.message);
        if (selectedTheaterId) {
          setLoading(true);
          await fetchMovies(selectedTheaterId);
          setLoading(false);
        }
      } else {
        toast.error(res.data.message || "Failed to delete movie");
      }
    } catch (err) {
      console.error("❌ Error deleting movie:", err);
      toast.error("Something went wrong while deleting the movie");
    }
  };

  const editMovie = (movieId: string) => {
    router.push(`/theaterOwner/editMovie/${movieId}`);
  };

  const handleFetchMovies = async (theaterId: string) => {
    setLoading(true);
    await fetchMovies(theaterId);
    setLoading(false);
  };

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🎬 View Movies by Theater</h1>

      <div className="mb-6 space-x-4">
        {theaterList.map((theater: TheaterType) => (
          <button
            key={theater._id}
            onClick={() => handleFetchMovies(theater._id)}
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

      {loading ? (
        <Loading />
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onEdit={editMovie}
              onDelete={deleteMovie}
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
