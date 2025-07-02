"use client";
import React, { useState } from "react";
import Movie from "./Movie";
import Loading from "../Loading";
import { MovieType } from "@/lib/types";

const MoviesSection = ({ movies }: { movies: MovieType[] }) => {
  const [filters, setFilters] = useState({
    title: "",
    genre: "",
    language: "",
    releaseYear: "",
  });

  if (!movies) return <Loading />;

  const filteredMovies = movies.filter((movie) => {
    const { title, genre, language, releaseYear } = filters;

    let keep = true;

    if (title && !movie.title.toLowerCase().includes(title.toLowerCase())) {
      keep = false;
    }

    if (
      genre &&
      !movie.genres.some(
        (g: any) => g.name.toLowerCase() === genre.toLowerCase()
      )
    ) {
      keep = false;
    }

    if (
      language &&
      movie.original_language.toLowerCase() !== language.toLowerCase()
    ) {
      keep = false;
    }

    if (releaseYear && !movie.release_date.startsWith(releaseYear)) {
      keep = false;
    }

    return keep;
  });

  return (
    <div className="pb-20">
      <h2 className="text-xl font-semibold mb-6 text-white">🎬 Movies</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search Title"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          className="p-2 border rounded w-full"
        />

        <input
          type="text"
          placeholder="Genre"
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          className="p-2 border rounded w-full"
        />

        <input
          type="text"
          placeholder="Language"
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          className="p-2 border rounded w-full"
        />

        <input
          type="number"
          placeholder="Release Year"
          value={filters.releaseYear}
          onChange={(e) =>
            setFilters({ ...filters, releaseYear: e.target.value })
          }
          className="p-2 border rounded w-full"
        />

        <button
          onClick={() =>
            setFilters({
              title: "",
              genre: "",
              language: "",
              releaseYear: "",
            })
          }
          className="p-2 border rounded bg-red-500 text-white hover:bg-red-600 col-span-2 md:col-span-1"
        >
          Reset
        </button>
      </div>

      {/* Filtered Movies */}
      {filteredMovies.length === 0 ? (
        <p className="text-white">No movies found for selected filters.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <Movie key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesSection;
