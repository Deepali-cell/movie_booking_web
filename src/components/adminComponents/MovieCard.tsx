"use client";
import { Show } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface MovieCardProps {
  show: Show;
}

const MovieCard: React.FC<MovieCardProps> = ({ show }) => {
  const router = useRouter();
  const { movie, showPrice } = show;

  return (
    <div className="w-full max-w-xs bg-blue-900 text-white rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] transition-all">
      {/* Movie Image */}
      <Image
        src={movie.backdrop_path}
        alt={movie.title}
        width={300}
        height={200}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => router.push(`/movieDetail/${movie._id}`)}
      />

      {/* Content */}
      <div className="p-4">
        {/* Movie Title */}
        <h2 className="text-lg font-bold mb-2">{movie.title}</h2>

        {/* Rating & Price */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-yellow-400 font-semibold">
            ⭐ {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-green-400 font-bold">₹{showPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
