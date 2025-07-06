"use client";
import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import TheaterForm from "@/components/ownerComponents/commonComponentsOfOwner/TheaterForm";

interface TheaterFormData {
  name: string;
  description?: string;
  image: string;
  location: {
    addressLine?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    landmarks?: string[];
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  basicServices: string[];
  screens: {
    name: string;
    capacity: number;
    type: "Normal" | "3D" | "IMAX";
  }[];
  tier: "normal" | "premium" | "luxury" | "budget";
}

const AddTheater: React.FC = () => {
  const router = useRouter();

  const handleAdd = async (formData: TheaterFormData) => {
    try {
      const { data } = await axios.post("/api/owner/addNewTheater", formData);
      if (data.success) {
        toast.success(data.message);
        router.push("/theaterOwner/theatersList");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("❌ Submit failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-white">
        🎬 Add Theater
      </h1>
      <TheaterForm mode="add" onSubmit={handleAdd} />
    </div>
  );
};

export default AddTheater;
