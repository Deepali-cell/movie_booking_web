"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
}

const EditFoodCourtPage = () => {
  const { foodCourtId } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    location: { block: "", floor: "" },
    foodService: {
      deliveryType: "self-service",
      allowsAllergyNote: true,
    },
  });

  useEffect(() => {
    const fetchFoodCourt = async () => {
      try {
        const { data } = await axios.get(
          `/api/fetchFoodCourtById?foodCourtId=${foodCourtId}`
        );
        if (data.success) {
          const fc = data.foodCourt;
          setFormData({
            name: fc.name,
            location: {
              block: fc.location?.block || "",
              floor: fc.location?.floor || "",
            },
            foodService: {
              deliveryType: fc.foodService?.deliveryType || "self-service",
              allowsAllergyNote:
                fc.foodService?.allowsAllergyNote !== undefined
                  ? fc.foodService.allowsAllergyNote
                  : true,
            },
          });
        } else {
          toast.error("Failed to fetch food court");
        }
      } catch (error) {
        toast.error("Error loading food court");
        console.error(error);
      }
    };

    if (foodCourtId) fetchFoodCourt();
  }, [foodCourtId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [key]: value,
        },
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
      // explicitly cast to HTMLInputElement to access checked
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        foodService: {
          ...prev.foodService,
          allowsAllergyNote: isChecked,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/owner/editFoodCourt?foodCourtId=${foodCourtId}`,
        formData
      );
      if (data.success) {
        toast.success(data.message);
        router.push("/theaterOwner/foodCourtList");
      } else {
        toast.error(data.message);
      }
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
        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-semibold">
            Food Court Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter food court name"
          />
        </div>

        {/* Block & Floor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Block</label>
            <input
              type="text"
              name="location.block"
              value={formData.location.block}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Block name"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Floor</label>
            <input
              type="text"
              name="location.floor"
              value={formData.location.floor}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full px-3 py-2 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="allowsAllergyNote" className="ml-2 text-sm">
            Allow Allergy Notes from Customers
          </label>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg text-white font-semibold transition"
        >
          💾 Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditFoodCourtPage;
