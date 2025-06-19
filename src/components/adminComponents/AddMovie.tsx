"use client";
import { MovieForm } from "@/lib/types";
import Image from "next/image";
import React, { useState } from "react";

const genreOptions = [
  { id: 28, name: "Action" },
  { id: 14, name: "Fantasy" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
];

const AddMovie = () => {
  const [form, setForm] = useState<MovieForm>({
    title: "",
    overview: "",
    poster_path: "",
    backdrop_path: "",
    genres: [],
    casts: [{ name: "", profile_path: "" }],
    release_date: "",
    original_language: "",
    tagline: "",
    vote_average: "",
    vote_count: "",
    runtime: "",
  });

  const [posterPreview, setPosterPreview] = useState<string>("");
  const [backdropPreview, setBackdropPreview] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleGenreToggle = (id: number) => {
    const updated = form.genres.includes(id)
      ? form.genres.filter((gid) => gid !== id)
      : [...form.genres, id];
    setForm({ ...form, genres: updated });
  };

  const handleCastChange = (
    index: number,
    field: "name" | "profile_path",
    value: string
  ) => {
    const updatedCasts = [...form.casts];
    updatedCasts[index][field] = value;
    setForm({ ...form, casts: updatedCasts });
  };

  const addCast = () => {
    setForm({
      ...form,
      casts: [...form.casts, { name: "", profile_path: "" }],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Movie Data Submitted:", form);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-semibold mb-6">Add New Movie</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Movie Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Overview */}
        <textarea
          name="overview"
          placeholder="Movie Overview"
          value={form.overview}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border rounded"
          required
        />

        {/* Poster Upload */}
        <div>
          <p className="mb-1 font-medium">Poster Image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]; // safe optional chaining
              if (file) {
                const url = URL.createObjectURL(file);
                setPosterPreview(url);
                setForm({ ...form, poster_path: url });
              }
            }}
            className="w-full p-2 border rounded"
          />

          {posterPreview && (
            <Image
              src={posterPreview}
              alt="Poster Preview"
              height={48}
              width={48}
              className="mt-2 rounded object-cover"
            />
          )}
        </div>

        {/* Backdrop Upload */}
        <div>
          <p className="mb-1 font-medium">Backdrop Image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setBackdropPreview(url);
                setForm({ ...form, backdrop_path: url });
              }
            }}
            className="w-full p-2 border rounded"
          />

          {backdropPreview && (
            <Image
              src={backdropPreview}
              alt="Backdrop Preview"
              height={48}
              width={48}
              className="mt-2 rounded object-cover"
            />
          )}
        </div>

        {/* Genres */}
        <div>
          <p className="mb-2 font-medium">Genres:</p>
          <div className="flex flex-wrap gap-3">
            {genreOptions.map((genre) => (
              <label key={genre.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.genres.includes(genre.id)}
                  onChange={() => handleGenreToggle(genre.id)}
                />
                {genre.name}
              </label>
            ))}
          </div>
        </div>

        {/* Casts */}
        <div>
          <p className="font-medium mb-2">Casts:</p>
          {form.casts.map((cast, index) => (
            <div key={index} className="mb-4 p-3 border rounded space-y-2">
              <input
                type="text"
                placeholder="Cast Name"
                value={cast.name}
                onChange={(e) =>
                  handleCastChange(index, "name", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    const updatedCasts = [...form.casts];
                    updatedCasts[index].profile_path = url;
                    setForm({ ...form, casts: updatedCasts });
                  }
                }}
                className="w-full p-2 border rounded"
              />

              {cast.profile_path && (
                <Image
                  src={cast.profile_path}
                  alt="Cast Preview"
                  height={32}
                  width={32}
                  className="mt-2 rounded object-cover"
                />
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCast}
            className="mt-1 text-blue-600 hover:underline"
          >
            + Add Another Cast
          </button>
        </div>

        {/* Other Fields */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="release_date"
            value={form.release_date}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="original_language"
            placeholder="Language (e.g. en)"
            value={form.original_language}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="tagline"
            placeholder="Tagline"
            value={form.tagline}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            step="0.1"
            name="vote_average"
            placeholder="Rating (e.g. 6.4)"
            value={form.vote_average}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="vote_count"
            placeholder="Vote Count"
            value={form.vote_count}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="runtime"
            placeholder="Runtime (in mins)"
            value={form.runtime}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
