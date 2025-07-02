"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MovieType } from "@/lib/types";

const MovieCard = ({
  movie,
  onEdit,
  onDelete,
}: {
  movie: MovieType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="bg-black border border-white rounded-2xl shadow-lg text-white p-4 max-w-md mx-auto">
      <div className="relative w-full h-64 mb-4 border border-gray-800 rounded-lg overflow-hidden">
        <Image
          src={movie.poster_path}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover rounded-lg"
        />
      </div>

      <h2 className="text-2xl font-bold mb-1">{movie.title}</h2>
      <p className="italic text-gray-300 text-sm mb-2">{movie.tagline}</p>
      <p className="text-sm text-gray-400 mb-2">{movie.overview}</p>

      <div className="text-sm space-y-1">
        <p>
          <strong>🎬 Genres:</strong>{" "}
          {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
        </p>
        <p>
          <strong>🗣️ Language:</strong> {movie.original_language}
        </p>
        <p>
          <strong>📅 Release Date:</strong> {movie.release_date}
        </p>
        <p>
          <strong>⏱️ Runtime:</strong> {movie.runtime} minutes
        </p>
        <p>
          <strong>⭐ Rating:</strong> {movie.vote_average} ({movie.vote_count}{" "}
          votes)
        </p>
      </div>

      <div className="mt-3">
        <p className="font-semibold text-sm">🎭 Casts:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {movie.casts?.map((cast, index) => (
            <div key={index} className="flex items-center gap-1 text-xs">
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={cast.profile_path}
                  alt={cast.name}
                  fill
                  sizes="24px"
                  className="object-cover rounded-full"
                />
              </div>
              <span>{cast.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-4">
        <Button
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => onDelete(movie._id)}
        >
          Delete
        </Button>
        <Button
          className="bg-white text-black hover:bg-gray-200"
          onClick={() => onEdit(movie._id)}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default MovieCard;
