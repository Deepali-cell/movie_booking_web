"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useStateContext } from "@/context/StateContextProvider";
import {
  useGetFoodCourtByIdQuery,
  useUpdateFoodCourtMutation,
} from "@/app/serveces/foodCourtApi";

interface FormDataType {
  name: string;
  location: {
    block: string;
    floor: string;
  };
  foodService: {
    deliveryType: "self-service" | "in-seat";
    allowsAllergyNote: boolean;
  };
  theaterId?: string;
}

const EditFoodCourtPage = () => {
  const { foodCourtId } = useParams();
  const router = useRouter();
  const { fetchBlocks, blocks } = useStateContext();
  const [updateFoodCourt] = useUpdateFoodCourtMutation();

  const { data, isLoading } = useGetFoodCourtByIdQuery(foodCourtId);
  const [formData, setFormData] = useState({
    name: "",
    location: { block: "", floor: "" },
    foodService: { deliveryType: "self-service", allowsAllergyNote: true },
    theaterId: "",
  });

  useEffect(() => {
    if (data?.success) {
      const fc = data.foodCourt;
      setFormData({
        name: fc.name,
        location: {
          block: fc.location?.block || "",
          floor: fc.location?.floor || "",
        },
        foodService: {
          deliveryType: fc.foodService?.deliveryType || "self-service",
          allowsAllergyNote: fc.foodService?.allowsAllergyNote ?? true,
        },
        theaterId: fc.theaterId,
      });
      if (fc.theaterId) fetchBlocks(fc.theaterId);
    }
  }, [data, fetchBlocks]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else if (name === "deliveryType") {
      setFormData((prev) => ({
        ...prev,
        foodService: {
          ...prev.foodService,
          deliveryType: value as "self-service" | "in-seat",
        },
      }));
    } else if (name === "allowsAllergyNote") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        foodService: { ...prev.foodService, allowsAllergyNote: isChecked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateFoodCourt({ foodCourtId, ...formData }).unwrap();
      toast.success("Updated successfully");
      router.back();
    } catch (err) {
      toast.error("Update failed");
    }
  };
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 bg-black text-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">
        ✏️ Edit Food Court
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-semibold">
            Food Court Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-white text-black"
            placeholder="Enter food court name"
          />
        </div>

        {/* Block Selection */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-white">
            Block (of Theater)
          </label>
          <select
            name="location.block"
            value={formData.location.block}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-white text-black"
          >
            <option value="">Select Block</option>
            {blocks.map((block) => (
              <option key={block._id} value={block.name}>
                {block.name} (Screen: {block.screen})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Floor</label>
            <input
              type="text"
              name="location.floor"
              value={formData.location.floor}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-white text-black"
              placeholder="Floor number"
            />
          </div>
        </div>

        {/* Delivery Type */}
        <div>
          <label className="block mb-1 text-sm font-semibold">
            Delivery Type
          </label>
          <select
            name="deliveryType"
            value={formData.foodService.deliveryType}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-white text-black"
          >
            <option value="self-service">Self Service</option>
            <option value="in-seat">In Seat Delivery</option>
          </select>
        </div>

        {/* Allergy Note */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="allowsAllergyNote"
            checked={formData.foodService.allowsAllergyNote}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label htmlFor="allowsAllergyNote" className="ml-2 text-sm">
            Allow Allergy Notes
          </label>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg text-white font-semibold"
        >
          💾 Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditFoodCourtPage;
