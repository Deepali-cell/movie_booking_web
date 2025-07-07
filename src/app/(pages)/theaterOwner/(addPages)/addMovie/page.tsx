"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useStateContext } from "@/context/StateContextProvider";
import toast from "react-hot-toast";
import { MovieFormType } from "@/lib/types";
import MovieForm from "@/components/ownerComponents/commonComponentsOfOwner/MovieForm";
import { useAddMovieMutation } from "@/app/serveces/movieApi";

const AddMovie = () => {
  const [formData, setFormData] = useState<MovieFormType>({
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
  });
  const { theaterList, uploadFile } = useStateContext();
  const [selectedTheaterId, setSelectedTheaterId] = useState("");
  const [addMovie] = useAddMovieMutation();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTheaterId) return toast.error("Please select a theater");

    try {
      await addMovie({
        ...formData,
        theaterId: selectedTheaterId,
      }).unwrap();
      toast.success("Movie added successfully!");
      router.push("/theaterOwner/moviesList");
    } catch (err) {
      toast.error("Failed to add movie");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <MovieForm
        formData={formData}
        setFormData={setFormData}
        selectedTheaterId={selectedTheaterId}
        setSelectedTheaterId={setSelectedTheaterId}
        onSubmit={handleSubmit}
        uploadFile={uploadFile}
        theaterList={theaterList}
        isEditMode={false}
      />
    </div>
  );
};

export default AddMovie;
