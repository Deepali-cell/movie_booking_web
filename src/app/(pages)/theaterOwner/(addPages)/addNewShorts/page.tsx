"use client";
import React, { useEffect, useState } from "react";
import { useStateContext } from "@/context/StateContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { MovieType, TheaterType } from "@/lib/types";
import { useRouter } from "next/navigation";

const Page = () => {
  const { theaterList, fetchMovies, movies, setMovies, uploadFile } =
    useStateContext();

  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(
    null
  );
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSelectTheater = async (theaterId: string) => {
    setSelectedTheaterId(theaterId);
    setSelectedMovie(null);
    await fetchMovies(theaterId);
  };

  const handleAddShort = async () => {
    if (!selectedMovie || !selectedFile) {
      toast.error("Select a movie and upload a short file.");
      return;
    }

    try {
      setLoading(true);
      // ✅ upload to cloudinary first
      const url = await uploadFile(selectedFile);

      // ✅ then send to your API
      const res = await axios.post("/api/owner/addNewShort", {
        movieId: selectedMovie._id,
        shortUrl: url,
      });

      if (res.data.success) {
        toast.success("Short added successfully!");
        setMovies((prev) =>
          prev.map((m) =>
            m._id === selectedMovie._id
              ? { ...m, shorts: [...m.shorts, url] }
              : m
          )
        );
        setSelectedMovie({
          ...selectedMovie,
          shorts: [...selectedMovie.shorts, url],
        });
        setSelectedFile(null);
        router.push(`/theaterOwner/moviesList`);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error adding short:", err);
      toast.error("Failed to add short.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🎬 Manage Movie Shorts</h1>

      {/* Select Theater */}
      <div className="mb-6 flex gap-4 flex-wrap">
        {theaterList.map((theater: TheaterType) => (
          <button
            key={theater._id}
            onClick={() => handleSelectTheater(theater._id)}
            className={`px-4 py-2 rounded-full border transition ${
              selectedTheaterId === theater._id
                ? "bg-white text-black"
                : "bg-transparent text-white border-white hover:bg-white hover:text-black"
            }`}
          >
            {theater.name}
          </button>
        ))}
      </div>

      {/* Select Movie */}
      {selectedTheaterId && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Select a Movie</h2>
          <div className="flex gap-4 flex-wrap">
            {movies.length ? (
              movies.map((movie) => (
                <button
                  key={movie._id}
                  onClick={() => setSelectedMovie(movie)}
                  className={`px-4 py-2 border rounded ${
                    selectedMovie?._id === movie._id
                      ? "bg-white text-black"
                      : "bg-transparent border-white text-white"
                  }`}
                >
                  {movie.title}
                </button>
              ))
            ) : (
              <p>No movies found for this theater.</p>
            )}
          </div>
        </>
      )}

      {/* Show Shorts + Upload */}
      {selectedMovie && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Shorts for {selectedMovie.title}
          </h3>
          <ul className="mb-6 list-disc pl-6 space-y-2">
            {selectedMovie.shorts.length ? (
              selectedMovie.shorts.map((short, idx) => (
                <li key={idx} className="text-white">
                  {short}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No shorts yet.</li>
            )}
          </ul>

          <div className="flex flex-col gap-4 w-1/2">
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="p-2 rounded bg-gray-800 border border-gray-600"
            />
            <button
              onClick={handleAddShort}
              disabled={loading}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              {loading ? "Uploading..." : "Upload & Add Short"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
