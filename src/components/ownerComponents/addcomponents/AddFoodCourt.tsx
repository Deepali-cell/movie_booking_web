"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStateContext } from "@/context/StateContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BlockType, TheaterType } from "@/lib/types";
import Image from "next/image";

type FoodItem = {
  name: string;
  type: "snack" | "beverage" | "meal";
  price: number;
  isVegetarian: boolean;
  isVegan: boolean;
  image: string;
};

const AddFoodCourt = () => {
  const { theaterList, uploadFile, blocks, fetchBlocks } = useStateContext();
  const router = useRouter();
  const [formData, setFormData] = useState({
    theater: "",
    name: "",
    location: { block: "", floor: "" },
    foodMenu: [] as FoodItem[],
    foodService: {
      deliveryType: "self-service" as "in-seat" | "self-service",
      allowsAllergyNote: true,
    },
  });

  const [newItem, setNewItem] = useState<FoodItem>({
    name: "",
    type: "snack",
    price: 0,
    isVegetarian: true,
    isVegan: false,
    image: "",
  });

  const handleMainChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // fetch blocks on theater change
    if (name === "theater") {
      await fetchBlocks(value);
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, block: "" }, // clear previous block
      }));
    }
  };

  const handleLocationChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleItemChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setNewItem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleServiceChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      foodService: {
        ...prev.foodService,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadFile(e.target.files[0]);
      setNewItem((prev) => ({ ...prev, image: url }));
    }
  };

  const addMenuItem = () => {
    setFormData((prev) => ({
      ...prev,
      foodMenu: [...prev.foodMenu, newItem],
    }));
    setNewItem({
      name: "",
      type: "snack",
      price: 0,
      isVegetarian: true,
      isVegan: false,
      image: "",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/owner/addFoodCourt", formData);
      if (data.success) {
        toast.success("✅ Food Court added successfully!");
        router.push("/theaterOwner/foodCourtList");
      }
    } catch (error: any) {
      console.error("❌ Error submitting food court:", error);
      toast.error("❌ Failed to submit food court");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow text-black">
      <h2 className="text-3xl font-bold mb-6 text-center">Add Food Court</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Theater</Label>
          <select
            name="theater"
            value={formData.theater}
            onChange={handleMainChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Theater</option>
            {theaterList.map((t: TheaterType) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Food Court Name</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleMainChange}
            required
          />
        </div>

        <div>
          <Label>Block</Label>
          <select
            name="block"
            value={formData.location.block}
            onChange={handleLocationChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Block</option>
            {blocks.map((b: BlockType) => (
              <option key={b._id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Floor</Label>
          <Input
            name="floor"
            value={formData.location.floor}
            onChange={handleLocationChange}
          />
        </div>

        <div>
          <Label>Food Service Type</Label>
          <select
            name="deliveryType"
            value={formData.foodService.deliveryType}
            onChange={handleServiceChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="self-service">Self Service</option>
            <option value="in-seat">In-Seat Delivery</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allowsAllergyNote"
            checked={formData.foodService.allowsAllergyNote}
            onChange={handleServiceChange}
          />
          <Label>Allow Allergy Notes</Label>
        </div>

        {/* Food Menu Entry */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Add Food Item</h3>
          <Input
            name="name"
            placeholder="Item Name"
            value={newItem.name}
            onChange={handleItemChange}
            required
          />
          <select
            name="type"
            value={newItem.type}
            onChange={handleItemChange}
            className="w-full mt-2 border px-2 py-1 rounded"
          >
            <option value="snack">Snack</option>
            <option value="beverage">Beverage</option>
            <option value="meal">Meal</option>
          </select>
          <Input
            name="price"
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={handleItemChange}
            className="mt-2"
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isVegetarian"
              checked={newItem.isVegetarian}
              onChange={handleItemChange}
            />
            <Label>Vegetarian</Label>
            <input
              type="checkbox"
              name="isVegan"
              checked={newItem.isVegan}
              onChange={handleItemChange}
            />
            <Label>Vegan</Label>
          </div>
          <div className="mt-2">
            <Label>Item Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            {newItem.image && (
              <Image
                src={newItem.image}
                alt="Preview"
                width={80}
                height={80}
                className="w-20 h-20 mt-2 rounded object-cover"
              />
            )}
          </div>
          <Button type="button" className="mt-2" onClick={addMenuItem}>
            ➕ Add to Menu
          </Button>
        </div>

        {/* Menu Preview */}
        {formData.foodMenu.length > 0 && (
          <div className="mt-4 border p-2 rounded">
            <h4 className="font-semibold">Current Menu:</h4>
            <ul className="list-disc list-inside text-sm">
              {formData.foodMenu.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Image
                    src={newItem.image}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="w-20 h-20 mt-2 rounded object-cover"
                  />

                  <span>
                    {item.name} - ₹{item.price} ({item.type})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button type="submit">Submit Food Court</Button>
      </form>
    </div>
  );
};

export default AddFoodCourt;
