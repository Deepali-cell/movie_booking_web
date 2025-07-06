"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { useStateContext } from "@/context/StateContextProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TheaterType } from "@/lib/types";

const AddBlock = () => {
  const { theaterList } = useStateContext();
  const router = useRouter();
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
      const { data } = await axios.post("/api/owner/addNewBlock", formData);

      if (data.success) {
        toast.success(data.message);
        router.push("/theaterOwner/theatersList");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("❌ Submit failed:", err);
      toast.error("Something went wrong");
    }
  };

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
            {theaterList.map((theater: TheaterType) => (
              <option key={theater._id} value={theater._id}>
                {theater.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default AddBlock;
