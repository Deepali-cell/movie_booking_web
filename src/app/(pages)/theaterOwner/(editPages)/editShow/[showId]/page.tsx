"use client";
import React, { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useStateContext } from "@/context/StateContextProvider";
import { useGetShowByIdQuery, useUpdateShowMutation } from "@/app/serveces/app";
import { ShowFormData } from "@/lib/types";
import ShowForm from "@/components/ownerComponents/commonComponentsOfOwner/ShowForm";

const EditShowPage = () => {
  const { showId } = useParams() as { showId: string };
  const { theaterList } = useStateContext();
  const router = useRouter();

  const { data, isLoading } = useGetShowByIdQuery(showId, {
    skip: !showId,
  });
  const [updateShow] = useUpdateShowMutation();

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
    if (data?.show) {
      const show = data.show;
      setFormData({
        theaterId: show.blockId?.theaterId || "",
        blockId: show.blockId?._id || "",
        movie: show.movie?._id || "",
        showDate: show.showDate?.substring(0, 10) || "",
        showTime: show.showTime || "",
        showPrice: show.showPrice || 0,
        status: show.status || "scheduled",
      });
    }
  }, [data]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateShow({ showId, ...formData }).unwrap();
      toast.success("✅ Show updated successfully");
      router.push("/theaterOwner/showsList");
    } catch {
      toast.error("❌ Failed to update show");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow text-black">
      <h2 className="text-2xl font-bold mb-6">🎬 Edit Show</h2>
      {!isLoading && (
        <ShowForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          theaterList={theaterList}
          isEditMode
        />
      )}
    </div>
  );
};

export default EditShowPage;
