"use client";

import Loading from "@/components/common/Loading";
import { FoodItemType } from "@/lib/types";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

const EditFoodItem = () => {
  const searchParams = useSearchParams();
  const foodCourtId = searchParams.get("foodCourtId");

  const itemName = searchParams.get("itemName")?.trim();
  const router = useRouter();

  const [formData, setFormData] = useState<FoodItemType>({
    _id: "",
    name: "",
    image: "",
    type: "snack",
    price: 0,
    isVegetarian: true,
    isVegan: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/owner/fetchFoodItem?foodCourtId=${foodCourtId}&itemName=${itemName}`
        );

        if (data.success) {
          setFormData(data.item);
        } else {
          toast.error(data.message || "Failed to load item.");
        }
      } catch (error) {
        toast.error("Failed to fetch food item");
      } finally {
        setLoading(false);
      }
    };

    if (foodCourtId && itemName) {
      fetchFoodItem();
    }
  }, [foodCourtId, itemName]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put<{ success: boolean; message: string }>(
        `/api/owner/editFoodItem`,
        {
          foodCourtId,
          originalName: itemName,
          updatedItem: formData,
        }
      );

      if (res.data.success) {
        toast.success("Item updated successfully");
        router.push("/theaterOwner/foodCourtList");
      } else {
        toast.error(res.data.message || "Failed to update item");
      }
    } catch (err) {
      toast.error("Failed to update item");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-black text-white py-10 px-6">
      <div className="max-w-2xl mx-auto bg-[#111] rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          ✏️ Edit Food Item
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">🍽️ Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded bg-white text-black"
              placeholder="Enter item name"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">🖼️ Image URL</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-3 rounded bg-white text-black"
              placeholder="Paste image URL"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">📦 Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 rounded bg-white text-black"
            >
              <option value="snack">Snack</option>
              <option value="beverage">Beverage</option>
              <option value="meal">Meal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">💰 Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 rounded bg-white text-black"
              min={0}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isVegetarian"
                checked={formData.isVegetarian}
                onChange={handleChange}
                className="accent-green-500 w-5 h-5"
              />
              Vegetarian
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isVegan"
                checked={formData.isVegan}
                onChange={handleChange}
                className="accent-green-500 w-5 h-5"
              />
              Vegan
            </label>
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold text-lg transition"
          >
            💾 Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
export default EditFoodItem;
