"use client";
import React, { useState, FormEvent } from "react";
import { TheaterType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";

import TheaterBasicInfoForm from "../TheaterForms/TheaterBasicInfoForm";
import TheaterLocationForm from "../TheaterForms/TheaterLocationForm";
import TheaterContactForm from "../TheaterForms/TheaterContactForm";
import TheaterBasicServiceForm from "../TheaterForms/TheaterBasicServiceForm";
import TheaterScreensForm from "../TheaterForms/TheaterScreensForm";
import TheaterSupportForm from "../TheaterForms/TheaterSupportForm";
import TheaterOperationPolicyForm from "../TheaterForms/TheaterOperationPolicyForm";
import TheaterOffDayForm from "../TheaterForms/TheaterOffDaysForm";
import TheaterFacilitiesForm from "../TheaterForms/TheaterFacilitiesForm";

// ✅ Custom partial type for the form
export type TheaterFormDataType = Omit<
  TheaterType,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "isActive"
  | "isVerified"
  | "moviesPlaying"
  | "allMovies"
  | "ratings"
  | "reviews"
  | "foodCourts"
  | "blocks"
>;

const defaultHours = { open: "09:00 AM", close: "11:00 PM" };

const defaultFormData: TheaterFormDataType = {
  name: "",
  description: "",
  image: "",
  location: {
    addressLine: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    landmarks: [""],
  },
  contact: { phone: "", email: "", website: "" },
  basicServices: [],
  operatingHours: { ...defaultHours },
  tier: "normal",
  cancellationPolicy: { refundable: false, refundWindowInHours: 0 },
  screens: [{ name: "", capacity: 0, type: "Normal" }],
  offDays: [],
  supportedGenres: [],
  supportedLanguages: ["Hindi", "English"],
  facilities: [
    {
      type: [],
      forCategory: ["all"],
      location: {},
      description: "",
      isAvailable: true,
    },
  ],
};

interface TheaterFormProps {
  mode?: "add" | "edit";
  initialData?: TheaterFormDataType;
  onSubmit: (formData: TheaterFormDataType) => Promise<void>;
}

const TheaterForm: React.FC<TheaterFormProps> = ({
  mode = "add",
  initialData = defaultFormData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<TheaterFormDataType>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof TheaterFormDataType
  ) => {
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const setNestedValue = (obj: any, path: string, value: any): any => {
    const keys = path.split(".");
    const lastKey = keys.pop()!;
    const nested = keys.reduce(
      (acc, key) => {
        if (!acc[key]) acc[key] = {};
        return acc[key];
      },
      { ...obj }
    );
    let temp = nested;
    for (let i = 0; i < keys.length - 1; i++) {
      temp = temp[keys[i]];
    }
    temp[lastKey] = value;
    return { ...obj, ...nested };
  };

  const handleChangeForObject = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string
  ) => {
    setFormData((prev) => setNestedValue(prev, key, e.target.value));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", form);
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
        toast.success("✅ Image uploaded successfully!");
      } else {
        toast.error("❌ Upload failed");
      }
    } catch (error: unknown) {
      toast.error("Upload error");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-white">
      <TheaterBasicInfoForm
        formData={formData}
        handleChange={handleChange}
        handleImageUpload={handleImageUpload}
      />
      <TheaterLocationForm
        formData={formData}
        handleChange={handleChangeForObject}
        setFormData={setFormData}
      />

      <TheaterContactForm
        formData={formData}
        handleChange={handleChangeForObject}
      />
      <TheaterBasicServiceForm
        basicServices={formData.basicServices}
        setBasicServices={(updated) =>
          setFormData((prev) => ({ ...prev, basicServices: updated }))
        }
      />
      <TheaterScreensForm
        screens={formData.screens}
        setScreens={(updated) =>
          setFormData((prev) => ({ ...prev, screens: updated }))
        }
      />
      <TheaterSupportForm
        supportedLanguages={formData.supportedLanguages}
        supportedGenres={formData.supportedGenres}
        setFormData={setFormData}
      />
      <TheaterFacilitiesForm formData={formData} setFormData={setFormData} />
      <TheaterOffDayForm offDays={formData.offDays} setFormData={setFormData} />
      <TheaterOperationPolicyForm
        operatingHours={formData.operatingHours}
        setOperatingHours={(updated) =>
          setFormData((prev) => ({ ...prev, operatingHours: updated }))
        }
        tier={formData.tier}
        setTier={(tier) => setFormData((prev) => ({ ...prev, tier }))}
        cancellationPolicy={formData.cancellationPolicy}
        setCancellationPolicy={(updated) =>
          setFormData((prev) => ({ ...prev, cancellationPolicy: updated }))
        }
      />
      <Button
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold"
      >
        {mode === "edit" ? "Update Theater" : "Submit Theater"}
      </Button>
    </form>
  );
};

export default TheaterForm;
