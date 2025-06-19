"use client";
import { Movie } from "@/lib/types";
import { timeFormat } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

const SingleMovieCard = ({ movie }: { movie: Movie }) => {
  const navigate = useRouter();
  return (
    <div className="w-full max-w-xs bg-blue-900 text-white rounded-lg shadow-lg overflow-hidden">
      {/* Movie Image */}
      <Image
        src={movie.backdrop_path}
        alt={movie.title}
        width={300}
        height={200}
        className="w-full h-48 object-cover px-2 py-2 rounded-md"
        onClick={() => navigate.push(`/movieDetail/${movie._id}`)}
      />

      {/* Content */}
      <div className="p-4">
        {/* Movie Title */}
        <h2 className="text-lg font-bold mb-1">{movie.title}</h2>

        {/* Info: Year • Category • Duration */}
        <p className="text-sm mb-4 text-gray-200">
          {new Date(movie.release_date).getFullYear()} •{" "}
          {movie.genres
            .slice(0, 2)
            .map((genre) => genre.name)
            .join("|")}
          • {timeFormat({ time: movie.runtime })}
        </p>

        {/* Buy Button & Rating */}
        <div className="flex items-center justify-between">
          <button className="bg-red-500 text-white px-4 py-1.5 rounded-full hover:bg-red-600 transition flex items-center gap-2 text-sm">
            Buy Tickets
            <FaLongArrowAltRight />
          </button>
          <span className="text-yellow-400 font-semibold text-sm">
            ⭐ {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SingleMovieCard;
