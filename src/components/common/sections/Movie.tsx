"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, MouseEvent } from "react";
import { Heart } from "lucide-react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useClerk, useUser } from "@clerk/nextjs"; // 👈 useUser for auth check
import { MovieType } from "@/lib/types";
import Image from "next/image";

const Movie = ({ movie }: { movie: MovieType }) => {
  const router = useRouter();
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser(); // 👈 check if user logged in

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!isSignedIn) {
        setLoading(false);
        return; // ❌ Don't call API if user not logged in
      }

      try {
        const { data } = await axios.get("/api/findFavourities");
        if (data.success) {
          setIsFavourite(data.favourites.includes(movie._id));
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch favourites", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [movie._id, isSignedIn]); // 👈 only run when user is authenticated

  const handleAddToFavourites = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isSignedIn) {
      // 👈 If not logged in, open login popup
      toast.error("Please login to add to favourites");
      openSignIn({
        afterSignInUrl: "/roleCheck",
        afterSignUpUrl: "/roleCheck",
      });
      return;
    }

    try {
      const { data } = await axios.post(`/api/favourites/${movie._id}`);
      if (data.success) {
        setIsFavourite((prev) => !prev);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const axiosErr = error as AxiosError<{ message: string }>;
      toast.error(axiosErr.response?.data?.message || "Something went wrong");
      console.error("Error toggling favourite", axiosErr);
    }
  };
  return (
    <div
      key={movie._id}
      className="bg-gray-900 rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition relative"
      onClick={() => router.push(`/movieDetail/${movie._id}`)}
    >
      {!loading && (
        <button
          onClick={handleAddToFavourites}
          className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-500 hover:bg-red-100 transition"
        >
          {isFavourite ? <Heart fill="currentColor" /> : <Heart />}
        </button>
      )}

      <Image
        src={movie.poster_path}
        alt={movie.title}
        width={300}
        height={192}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="mt-2 font-bold">{movie.title}</h3>
      <p className="text-sm">{movie.overview.slice(0, 100)}...</p>
      <p className="text-sm text-blue-500 mt-1">
        ⭐ {movie.vote_average} | ⏱️ {movie.runtime} mins
      </p>
    </div>
  );
};

export default Movie;
