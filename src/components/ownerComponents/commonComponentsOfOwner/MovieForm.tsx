"use client";
import React, { FormEvent } from "react";
import Image from "next/image";
import { MovieFormType, TheaterType } from "@/lib/types";

interface MovieFormProps {
  formData: MovieFormType;
  setFormData: React.Dispatch<React.SetStateAction<MovieFormType>>;
  selectedTheaterId: string;
  setSelectedTheaterId: (id: string) => void;
  onSubmit: (e: FormEvent) => void;
  uploadFile?: (file: File) => Promise<string>;
  theaterList: TheaterType[];
  isEditMode?: boolean;
}

const MovieForm: React.FC<MovieFormProps> = ({
  formData,
  setFormData,
  selectedTheaterId,
  setSelectedTheaterId,
  onSubmit,
  uploadFile,
  theaterList,
  isEditMode = false,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["vote_average", "vote_count", "runtime"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "poster_path" | "backdrop_path"
  ) => {
    const file = e.target.files?.[0];
    if (file && uploadFile) {
      const url = await uploadFile(file);
      setFormData((prev) => ({ ...prev, [key]: url }));
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 bg-gray-900 p-4 sm:p-6 rounded-xl text-white"
    >
      {/* Title */}
      <div>
        <label className="block mb-1 font-semibold">🎬 Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        />
      </div>

      {/* Overview */}
      <div>
        <label className="block mb-1 font-semibold">📝 Overview</label>
        <textarea
          name="overview"
          value={formData.overview}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
      </div>

      {/* Tagline */}
      <div>
        <label className="block mb-1 font-semibold">📝 Tagline</label>
        <input
          type="text"
          name="tagline"
          value={formData.tagline}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
      </div>

      {/* 3-Column Inputs → become single column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-semibold">🌐 Language</label>
          <input
            type="text"
            name="original_language"
            value={formData.original_language}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">📅 Release Date</label>
          <input
            type="date"
            name="release_date"
            value={formData.release_date}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">⭐ Rating</label>
          <input
            type="number"
            name="vote_average"
            value={formData.vote_average}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>
      </div>

      {/* Vote Count + Runtime → 2-col on big screens, 1-col on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">👍 Vote Count</label>
          <input
            type="number"
            name="vote_count"
            value={formData.vote_count}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">⏱️ Runtime (min)</label>
          <input
            type="number"
            name="runtime"
            value={formData.runtime}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>
      </div>

      {/* Poster + Backdrop → stack on mobile */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Poster */}
        <div className="flex-1">
          <label className="block mb-1 font-semibold">🖼️ Poster</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "poster_path")}
            className="w-full p-2 bg-gray-800 rounded"
          />
          {formData.poster_path && (
            <div className="relative mt-2 w-full h-40">
              <Image
                src={formData.poster_path}
                alt="Poster"
                fill
                className="rounded object-cover"
              />
            </div>
          )}
        </div>

        {/* Backdrop */}
        <div className="flex-1">
          <label className="block mb-1 font-semibold">🖼️ Backdrop</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "backdrop_path")}
            className="w-full p-2 bg-gray-800 rounded"
          />

          {formData.backdrop_path && (
            <div className="relative mt-2 w-full h-40">
              <Image
                src={formData.backdrop_path}
                alt="Backdrop"
                fill
                className="rounded object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Select Theater */}
      <div>
        <label className="block mb-1 font-semibold">🏛️ Select Theater</label>
        <select
          value={selectedTheaterId}
          onChange={(e) => setSelectedTheaterId(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        >
          <option value="">-- Select --</option>
          {theaterList.map((theater) => (
            <option key={theater._id} value={theater._id}>
              {theater.name} ({theater.location?.city})
            </option>
          ))}
        </select>
      </div>

      {/* Genres */}
      <div>
        <label className="block mb-1 font-semibold">🎭 Genres</label>

        {formData.genres.map((genre, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              type="text"
              value={genre.name}
              onChange={(e) => {
                const newGenres = [...formData.genres];
                newGenres[idx].name = e.target.value;
                setFormData((prev) => ({ ...prev, genres: newGenres }));
              }}
              className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
            />

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  genres: prev.genres.filter((_, i) => i !== idx),
                }))
              }
              className="bg-red-600 px-3 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              genres: [...prev.genres, { id: prev.genres.length, name: "" }],
            }))
          }
          className="bg-green-600 px-4 py-1 rounded mt-2"
        >
          + Add Genre
        </button>
      </div>

      {/* Casts */}
      <div>
        <label className="block mb-1 font-semibold">🎭 Casts</label>

        {formData.casts.map((cast, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row gap-2 mb-2 items-start"
          >
            <input
              type="text"
              placeholder="Name"
              value={cast.name}
              onChange={(e) => {
                const newCasts = [...formData.casts];
                newCasts[idx].name = e.target.value;
                setFormData((prev) => ({ ...prev, casts: newCasts }));
              }}
              className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
            />

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file && uploadFile) {
                  const url = await uploadFile(file);
                  const newCasts = [...formData.casts];
                  newCasts[idx].profile_path = url;
                  setFormData((prev) => ({ ...prev, casts: newCasts }));
                }
              }}
              className="flex-1 sm:flex-none"
            />

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  casts: prev.casts.filter((_, i) => i !== idx),
                }))
              }
              className="bg-red-600 px-3 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              casts: [...prev.casts, { name: "", profile_path: "" }],
            }))
          }
          className="bg-green-600 px-4 py-1 rounded mt-2"
        >
          + Add Cast
        </button>
      </div>

      {/* Shorts */}
      <div>
        <label className="block mb-1 font-semibold">🎞️ Shorts</label>

        {formData.shorts.map((short, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row gap-2 mb-2 items-start"
          >
            <input
              type="file"
              accept="video/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file && uploadFile) {
                  const url = await uploadFile(file);
                  const newShorts = [...formData.shorts];
                  newShorts[idx] = url;
                  setFormData((prev) => ({ ...prev, shorts: newShorts }));
                }
              }}
              className="flex-1 p-2 bg-gray-800 rounded"
            />

            {short && (
              <video
                src={short}
                controls
                className="w-full sm:w-32 h-32 rounded object-cover"
              />
            )}

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  shorts: prev.shorts.filter((_, i) => i !== idx),
                }))
              }
              className="bg-red-600 px-3 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              shorts: [...prev.shorts, ""],
            }))
          }
          className="bg-green-600 px-4 py-1 rounded mt-2"
        >
          + Add Short
        </button>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-bold"
        >
          {isEditMode ? "Update Movie" : "Add Movie"}
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
