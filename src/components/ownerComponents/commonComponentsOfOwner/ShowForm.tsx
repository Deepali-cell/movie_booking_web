"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { BlockType, MovieType, TheaterType } from "@/lib/types";

interface ShowFormData {
  theaterId: string;
  blockId: string;
  movie: string;
  showDate: string;
  showTime: string;
  showPrice: number;
  status: "scheduled" | "cancelled" | "completed";
}

interface ShowFormProps {
  formData: ShowFormData;
  setFormData: React.Dispatch<React.SetStateAction<ShowFormData>>;
  onSubmit: (e: FormEvent) => void;
  theaterList: TheaterType[];
  isEditMode?: boolean;
}

const ShowForm: React.FC<ShowFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  theaterList,
  isEditMode = false,
}) => {
  const [blocks, setBlocks] = useState<BlockType[]>([]);
  const [movies, setMovies] = useState<MovieType[]>([]);

  useEffect(() => {
    if (formData.theaterId) {
      fetchBlocksAndMovies(formData.theaterId);
    }
  }, [formData.theaterId]);

  const fetchBlocksAndMovies = async (theaterId: string) => {
    try {
      const [blockRes, movieRes] = await Promise.all([
        axios.get(`/api/owner/fetchBlockList?theaterId=${theaterId}`),
        axios.get(`/api/owner/fetchMovieList?theaterId=${theaterId}`),
      ]);
      setBlocks(blockRes.data.blocks || []);
      setMovies(movieRes.data.movies || []);
    } catch (error) {
      console.error("❌ Error fetching blocks/movies:", error);
      toast.error("Failed to load blocks or movies.");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "showPrice" ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>Theater</Label>
        <select
          name="theaterId"
          value={formData.theaterId}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Theater</option>
          {theaterList.map((theater) => (
            <option key={theater._id} value={theater._id}>
              {theater.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Block</Label>
        <select
          name="blockId"
          value={formData.blockId}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Block</option>
          {blocks.map((block) => (
            <option key={block._id} value={block._id}>
              {block.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Movie</Label>
        <select
          name="movie"
          value={formData.movie}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Movie</option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Show Date</Label>
        <Input
          type="date"
          name="showDate"
          value={formData.showDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Show Time</Label>
        <Input
          type="time"
          name="showTime"
          value={formData.showTime}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Show Price</Label>
        <Input
          type="number"
          name="showPrice"
          value={formData.showPrice}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Status</Label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="scheduled">Scheduled</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <Button type="submit">
        {isEditMode ? "Update Show" : "Create Show"}
      </Button>
    </form>
  );
};

export default ShowForm;
