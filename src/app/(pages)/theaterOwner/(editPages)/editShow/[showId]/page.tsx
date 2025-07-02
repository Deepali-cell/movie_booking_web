"use client";

import ShowForm from "@/components/ownerComponents/commonComponentsOfOwner/ShowForm";
import { useStateContext } from "@/context/StateContextProvider";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface ShowFormData {
  theaterId: string;
  blockId: string;
  movie: string;
  showDate: string;
  showTime: string;
  showPrice: number;
  status: "scheduled" | "cancelled" | "completed";
}

const EditShowPage = () => {
  const { showId } = useParams();
  const { theaterList } = useStateContext();
  const router = useRouter();

  const [formData, setFormData] = useState<ShowFormData>({
    theaterId: "",
    blockId: "",
    movie: "",
    showDate: "",
    showTime: "",
    showPrice: 0,
    status: "scheduled",
  });

  useEffect(() => {
    if (!showId) return;

    const fetchShow = async () => {
      try {
        const { data } = await axios.get(`/api/getShowById?showId=${showId}`);
        if (data.success) {
          const show = data.show;

          setFormData({
            theaterId: show.theaterId || "",
            blockId: show.blockId || "",
            movie: show.movie || "",
            showDate: show.showDate?.substring(0, 10) || "",
            showTime: show.showTime || "",
            showPrice: show.showPrice || 0,
            status:
              (show.status as "scheduled" | "cancelled" | "completed") ||
              "scheduled",
          });
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to load show");
        console.error(error);
      }
    };

    fetchShow();
  }, [showId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/owner/editShow?showId=${showId}`,
        formData
      );
      if (data.success) {
        toast.success(data.message);
        router.push("/theaterOwner/showsList");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("❌ Failed to update show");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow text-black">
      <h2 className="text-2xl font-bold mb-6">🎬 Edit Show</h2>
      <ShowForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        theaterList={theaterList}
        isEditMode
      />
    </div>
  );
};

export default EditShowPage;
