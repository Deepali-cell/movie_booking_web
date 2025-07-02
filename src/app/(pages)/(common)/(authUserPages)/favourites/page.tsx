"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/common/Loading";
import Movie from "@/components/common/sections/Movie";

const Page = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const { data } = await axios.get("/api/getFavourities");
        if (data.success) {
          setFavourites(data.favourites);
        } else {
          toast.error(data.message || "Failed to fetch favourites");
        }
      } catch (error) {
        toast.error("Error fetching favourites");
        console.error("❌ Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="pt-20 px-4 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6">❤️ Your Favourites</h2>

      {favourites.length === 0 ? (
        <p className="text-white text-center">You have no favourite movies.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((movie: any) => (
            <Movie key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
