"use client";

import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useStateContext } from "@/context/StateContextProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import MovieForm from "../commonComponentsOfOwner/MovieForm";
import { MovieFormType } from "@/lib/types";

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
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedTheaterId) {
      toast.error("Please select a theater");
      return;
    }

    try {
      const { data } = await axios.post("/api/owner/addNewMovie", {
        ...formData,
        theaterId: selectedTheaterId,
      });

      if (data.success) {
        toast.success(data.message);
        router.push("/theaterOwner/moviesList");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("❌ Submit failed:", err);
      toast.error("Something went wrong");
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
