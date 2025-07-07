"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useStateContext } from "@/context/StateContextProvider";
import MovieForm from "@/components/ownerComponents/commonComponentsOfOwner/MovieForm";
import axios from "axios";
import { MovieFormType } from "@/lib/types";
import { useEditMovieMutation } from "@/app/serveces/movieApi";

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
  const [editMovie] = useEditMovieMutation();

  useEffect(() => {
    if (!movieId) return;
    const fetchMovie = async () => {
      try {
        const { data } = await axios.get(
          `/api/getMovieById?movieId=${movieId}`
        );
        if (data.success) {
          setFormData({ ...emptyMovieForm, ...data.movie });
          setSelectedTheaterId(data.movie.theaterId || "");
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error("Failed to load movie");
        console.error(err);
      }
    };
    fetchMovie();
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editMovie({
        movieId,
        ...formData,
        theaterId: selectedTheaterId,
      }).unwrap();
      toast.success("Updated movie successfully!");
      router.replace("/theaterOwner/moviesList");
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
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
