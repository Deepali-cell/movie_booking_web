"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { TheaterType } from "@/lib/types";

type TheaterFormDataType = Omit<
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

type Props = {
  formData: TheaterFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<TheaterFormDataType>>;
};

const FACILITY_TYPES = [
  "wheelchair",
  "ramp",
  "restroom",
  "child-seat",
  "emergency-exit",
  "parking",
  "medical-support",
  "food-court",
  "washroom",
  "wifi",
  "subtitle-screen",
  "heated-hall",
  "ac-hall",
  "charging-point",
  "security",
] as const;

const CATEGORIES = [
  "all",
  "elders",
  "disabled",
  "kids",
  "sensitive",
  "female-only",
] as const;

const TheaterFacilitiesForm: React.FC<Props> = ({ formData, setFormData }) => {
  return (
    <Card>
      <CardContent className="space-y-4">
        <Label>Facilities</Label>
        {formData.facilities.map((facility, idx) => (
          <div key={idx} className="space-y-3 border p-4 rounded-md">
            <div>
              <Label>Facility Types</Label>
              <div className="grid grid-cols-2 gap-2">
                {FACILITY_TYPES.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={facility.type.includes(type)}
                      onChange={() => {
                        const updated = [...formData.facilities];
                        const currentTypes = facility.type || [];
                        updated[idx].type = currentTypes.includes(type)
                          ? currentTypes.filter((t) => t !== type)
                          : [...currentTypes, type];
                        setFormData({ ...formData, facilities: updated });
                      }}
                    />
                    <Label>{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>For Category</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={facility.forCategory.includes(cat)}
                      onChange={() => {
                        const updated = [...formData.facilities];
                        const current = facility.forCategory || [];
                        updated[idx].forCategory = current.includes(cat)
                          ? current.filter((c) => c !== cat)
                          : [...current, cat];
                        setFormData({ ...formData, facilities: updated });
                      }}
                    />
                    <Label>{cat}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {["block", "screen", "floor", "near"].map((key) => (
                <Input
                  key={key}
                  placeholder={key}
                  value={
                    facility.location?.[
                      key as keyof typeof facility.location
                    ] || ""
                  }
                  onChange={(e) => {
                    const updated = [...formData.facilities];
                    updated[idx].location = {
                      ...updated[idx].location,
                      [key]: e.target.value,
                    };
                    setFormData({ ...formData, facilities: updated });
                  }}
                />
              ))}
            </div>

            <Textarea
              placeholder="Description"
              value={facility.description || ""}
              onChange={(e) => {
                const updated = [...formData.facilities];
                updated[idx].description = e.target.value;
                setFormData({ ...formData, facilities: updated });
              }}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={facility.isAvailable ?? false}
                onChange={(e) => {
                  const updated = [...formData.facilities];
                  updated[idx].isAvailable = e.target.checked;
                  setFormData({ ...formData, facilities: updated });
                }}
              />
              <Label>Is Available</Label>
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              facilities: [
                ...prev.facilities,
                {
                  type: [],
                  forCategory: ["all"],
                  location: {},
                  description: "",
                  isAvailable: true,
                },
              ],
            }))
          }
        >
          ➕ Add Facility
        </Button>
      </CardContent>
    </Card>
  );
};

export default TheaterFacilitiesForm;
