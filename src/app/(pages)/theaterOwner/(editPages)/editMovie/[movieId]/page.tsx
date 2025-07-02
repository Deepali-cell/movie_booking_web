"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useStateContext } from "@/context/StateContextProvider";
import MovieForm from "@/components/ownerComponents/commonComponentsOfOwner/MovieForm";
import { MovieFormType } from "@/lib/types";

const emptyMovieForm: MovieFormType = {
  title: "",
  overview: "",
  poster_path: "",
  backdrop_path: "",
  tagline: "",
  genres: [{ id: 0, name: "" }],
  casts: [{ name: "", profile_path: "" }],
  original_language: "",
  release_date: "",
  vote_average: 0,
  vote_count: 0,
  runtime: 0,
  shorts: [],
  movieReview: [],
};

const EditMovie = () => {
  const router = useRouter();
  const { movieId } = useParams();
  const { theaterList, uploadFile } = useStateContext();
  const [formData, setFormData] = useState<MovieFormType>(emptyMovieForm);
  const [selectedTheaterId, setSelectedTheaterId] = useState("");

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        const { data } = await axios.get(
          `/api/getMovieById?movieId=${movieId}`
        );
        if (data.success) {
          setFormData({
            ...emptyMovieForm,
            ...data.movie,
          });
          setSelectedTheaterId(data.movie.theaterId || "");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to load movie");
        console.error(error);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/owner/editMovie?movieId=${movieId}`,
        {
          ...formData,
          theaterId: selectedTheaterId,
        }
      );

      if (data.success) {
        toast.success("Movie updated successfully!");
        router.replace("/theaterOwner/moviesList");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Update failed");
      console.error("❌", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-10">
      <MovieForm
        formData={formData}
        setFormData={setFormData}
        selectedTheaterId={selectedTheaterId}
        setSelectedTheaterId={setSelectedTheaterId}
        onSubmit={handleSubmit}
        uploadFile={uploadFile}
        theaterList={theaterList}
        isEditMode={true}
      />
    </div>
  );
};

export default EditMovie;
