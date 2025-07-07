"use client";
import { Label } from "@/components/ui/label";
import { useStateContext } from "@/context/StateContextProvider";
import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { TheaterType } from "@/lib/types";
import Image from "next/image";

const Page = () => {
  const router = useRouter();
  const { theaterList } = useStateContext();
  const [formData, setFormData] = useState({
    theaterId: "",
    foodCourtId: "",
    name: "",
    image: "",
    type: "snack",
    price: "",
    isVegetarian: true,
    isVegan: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const selectedTheater = theaterList.find(
    (t: TheaterType) => t._id === formData.theaterId
  );

  const uploadFile = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);

    const { data } = await axios.post("/api/upload", form);
    if (data.success) {
      toast.success("✅ Image uploaded successfully!");
      return data.secure_url;
    } else {
      toast.error("❌ Upload failed");
    }
    throw new Error("Upload failed");
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadFile(e.target.files[0]);
      setFormData((prev) => ({ ...prev, image: url }));
    }
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        `/api/owner/addFoodItem?foodCourtId=${formData.foodCourtId}`,
        {
          name: formData.name,
          image: formData.image,
          type: formData.type,
          price: Number(formData.price),
          isVegetarian: formData.isVegetarian,
          isVegan: formData.isVegan,
        }
      );
      if (data.success) {
        toast.success(data.message);
        router.push("/theaterOwner/foodCourtList");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Error adding food item:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow text-black">
      <h2 className="text-2xl font-bold mb-6">Add New Food Item</h2>

      {/* 🎭 Select Theater */}
      <div className="mb-4">
        <Label>Theater</Label>
        <select
          name="theaterId"
          value={formData.theaterId}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Theater</option>
          {theaterList.map((theater: TheaterType) => (
            <option key={theater._id} value={theater._id}>
              {theater.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🍔 Select Food Court */}
      {selectedTheater && selectedTheater.foodCourts?.length > 0 && (
        <div className="mb-4">
          <Label>Food Court</Label>
          <select
            name="foodCourtId"
            value={formData.foodCourtId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Food Court</option>
            {selectedTheater.foodCourts.map((fc) => (
              <option key={fc._id} value={fc._id}>
                {fc.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="mt-2">
        <Label>Item Image</Label>
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {formData.image && formData.image !== "" && (
          <Image
            src={formData.image}
            alt="Preview"
            height={200}
            width={200}
            className="object-cover rounded"
          />
        )}
      </div>
      {/* 📝 Food Item Form */}
      <div className="mb-4">
        <Label>Food Name</Label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <Label>Price</Label>
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <Label>Type</Label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="snack">Snack</option>
          <option value="beverage">Beverage</option>
          <option value="meal">Meal</option>
        </select>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isVegetarian"
            checked={formData.isVegetarian}
            onChange={handleChange}
          />
          Vegetarian
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isVegan"
            checked={formData.isVegan}
            onChange={handleChange}
          />
          Vegan
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Food Item
      </button>
    </div>
  );
};

export default Page;
