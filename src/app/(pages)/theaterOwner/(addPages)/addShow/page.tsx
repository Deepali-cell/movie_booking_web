"use client";
import { useStateContext } from "@/context/StateContextProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, FormEvent } from "react";
import { ShowFormData } from "@/lib/types";
import ShowForm from "@/components/ownerComponents/commonComponentsOfOwner/ShowForm";

const AddShow = () => {
  const { theaterList } = useStateContext();
  const router = useRouter();

  // ✅ use correct type here
  const [formData, setFormData] = useState<ShowFormData>({
    theaterId: "",
    blockId: "",
    movie: "",
    showDate: "",
    showTime: "",
    showPrice: 0,
    status: "scheduled", // ✅ exact type
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/owner/addNewShow", formData);
      if (data.success) {
        toast.success("✅ Show created successfully!");
        router.push("/theaterOwner/showsList");
      }
    } catch (error) {
      toast.error("❌ Failed to create show");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow text-black">
      <h2 className="text-2xl font-bold mb-6">🎬 Add New Show</h2>
      <ShowForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        theaterList={theaterList}
      />
    </div>
  );
};

export default AddShow;
