"use client";

import React, { FormEvent } from "react";
import { MovieFormType, TheaterType } from "@/lib/types";
import Image from "next/image";

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
      [name]: value,
    }));
  };

  const handleGenresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const genresArray = e.target.value.split(",").map((s) => s.trim());
    setFormData((prev) => ({
      ...prev,
      genres: genresArray.map((name, index) => ({ id: index, name })),
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "poster_path" | "backdrop_path"
  ) => {
    const file = e.target.files?.[0];
    if (file && uploadFile) {
      const url = await uploadFile(file);
      setFormData((prev) => ({
        ...prev,
        [key]: url,
      }));
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 bg-gray-900 p-6 rounded-xl text-white"
    >
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

      <div>
        <label className="block mb-1 font-semibold">
          🎭 Genres (comma separated)
        </label>
        <input
          type="text"
          value={formData.genres.map((g) => g.name).join(", ")}
          onChange={handleGenresChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-semibold">🖼️ Poster Image</label>
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
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>

        <div className="flex-1">
          <label className="block mb-1 font-semibold">🖼️ Backdrop Image</label>
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
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>

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
