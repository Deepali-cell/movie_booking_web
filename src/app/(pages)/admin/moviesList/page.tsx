"use client";
import { dummyShowsData } from "@/assets/assets";
import AdminFeaturedSection from "@/components/adminComponents/AdminFeaturedSection";
import MoviesList from "@/components/adminComponents/MoviesList";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getList = () => {
    try {
      setList([
        {
          movie: dummyShowsData[0],
          movieDateTime: "2025-06-18 18:30",
          moviePrice: 78,
          occupiedSeats: { A1: "user_1", A4: "user_2", B2: "user_3" },
        },
        {
          movie: dummyShowsData[1],
          movieDateTime: "2025-06-18 20:00",
          moviePrice: 100,
          occupiedSeats: { C1: "user_4" },
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching movie list:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <AdminFeaturedSection headerTitle="Movies List" />
      <MoviesList list={list} loading={loading} />
    </div>
  );
};

export default Page;
