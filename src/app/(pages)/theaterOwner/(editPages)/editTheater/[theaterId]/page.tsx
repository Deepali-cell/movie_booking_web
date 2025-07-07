"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import TheaterForm from "@/components/ownerComponents/commonComponentsOfOwner/TheaterForm";
import { TheaterType } from "@/lib/types";
import { useEditTheaterMutation } from "@/app/serveces/theaterApi";
import axios from "axios";

const EditTheaterPage = () => {
  const params = useParams();
  const theaterId = params?.theaterId as string;
  const router = useRouter();
  const [initialData, setInitialData] = useState<TheaterType>();
  const [editTheater, { isLoading: isUpdating }] = useEditTheaterMutation();

  useEffect(() => {
    if (!theaterId) return;
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/getTheater?theaterId=${theaterId}`
        );
        if (data.success) {
          setInitialData(data.theater);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error("Failed to fetch theater data");
      }
    };
    fetchData();
  }, [theaterId]);

  const handleEdit = async (formData: any) => {
    try {
      await editTheater({ theaterId, ...formData }).unwrap();
      toast.success("Updated theater successfully");
      router.push("/theaterOwner/theatersList");
    } catch (err) {
      console.error(err);
      toast.error("❌ Update failed");
    }
  };

  if (!initialData) return <p className="text-white text-center">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-white">
        ✏️ Edit Theater
      </h1>
      <TheaterForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleEdit}
      />
    </div>
  );
};

export default EditTheaterPage;
