"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Loading from "@/components/common/Loading";
import CustomReview from "@/components/reviewComponents/CustomReview";
import ShowReview from "@/components/reviewComponents/ShowReview";

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await axios.get(
          `/api/getMovieById?movieId=${movieId}`
        );
        if (data.success) {
          setMovie(data.movie);
        } else {
          toast.error(data.message);
        }
      } catch (error: any) {
        console.error("Error fetching movie:", error);
        toast.error("Failed to fetch movie");
      }
    };

    if (movieId) fetchMovie();
  }, [movieId]);

  if (!movie) {
    return <Loading />;
  }

  return (
    <div className="pt-20 px-4 md:px-10 text-white">
      {/* 🔙 Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-4"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Title & tagline */}
      <h1 className="text-3xl font-bold mb-1">{movie.title}</h1>
      <p className="italic text-gray-400 mb-6">"{movie.tagline}"</p>

      {/* Poster + Details */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Poster */}
        <img
          src={movie.poster_path}
          className="w-78 h-100 rounded-lg object-cover border border-gray-600 shadow"
          alt={movie.title}
        />

        {/* Info */}
        <div className="flex-1 space-y-2">
          <p className="text-sm">{movie.overview}</p>
          <p>
            🎯 <strong>Language:</strong> {movie.original_language}
          </p>
          <p>
            📆 <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            ⏱️ <strong>Runtime:</strong> {movie.runtime} mins
          </p>
          <p>
            ⭐ <strong>Rating:</strong> {movie.vote_average} ({movie.vote_count}{" "}
            votes)
          </p>
          <p>
            🎬 <strong>Genres:</strong>{" "}
            {movie.genres.map((g: any) => g.name).join(", ")}
          </p>
        </div>
      </div>

      {/* Cast */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">🎭 Cast</h2>
        <div className="flex gap-4 flex-wrap">
          {movie.casts.map((cast: any, i: number) => (
            <div key={i} className="w-20 text-center">
              <img
                src={cast.profile_path}
                alt={cast.name}
                className="w-20 h-20 object-cover rounded-full border border-gray-500"
              />
              <p className="text-xs mt-1">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shorts */}
      {movie.shorts?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-3">🎞️ Shorts</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {movie.shorts.map((url: string, idx: number) => (
              <video
                key={idx}
                controls
                className="rounded w-full h-40 object-cover shadow-md"
              >
                <source src={url} type="video/mp4" />
              </video>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-8">
        {/* Add review form */}
        <CustomReview type="movie" id={movie._id} />

        {/* Show reviews */}
        <h3 className="text-xl font-semibold mt-8 mb-4 text-white">
          📝 Customer Reviews
        </h3>
        <ShowReview reviews={movie.movieReview} />
      </div>
    </div>
  );
};

export default MovieDetailPage;
