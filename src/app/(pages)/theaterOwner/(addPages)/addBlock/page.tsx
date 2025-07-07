"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TheaterType } from "@/lib/types";
import {
  useGetTheatersQuery,
  useAddBlockMutation,
} from "@/app/serveces/theaterApi";

const AddBlock = () => {
  const router = useRouter();
  const { data, isLoading } = useGetTheatersQuery();
  const [addBlock, { isLoading: isAdding }] = useAddBlockMutation();

  const [formData, setFormData] = useState({
    name: "",
    screen: "",
    theaterId: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await addBlock(formData).unwrap();
      toast.success(res.message || "Block added successfully");
      router.push("/theaterOwner/theatersList");
    } catch (err) {
      console.error("❌ Submit failed:", err);
      toast.error("Something went wrong");
    }
  };

  const theaterList: TheaterType[] = data?.theaters || [];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-white">
        Add Block
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-amber-50 p-4 rounded-lg text-black"
      >
        <div>
          <Label>Block Name</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label>Screen Type</Label>
          <Input
            name="screen"
            value={formData.screen}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label>Theater</Label>
          <select
            name="theaterId"
            value={formData.theaterId}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Theater</option>
            {isLoading ? (
              <option>Loading theaters...</option>
            ) : (
              theaterList.map((theater) => (
                <option key={theater._id} value={theater._id}>
                  {theater.name}
                </option>
              ))
            )}
          </select>
        </div>

        <Button type="submit" disabled={isAdding}>
          {isAdding ? "Adding..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default AddBlock;
