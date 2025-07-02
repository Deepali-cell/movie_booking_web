"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TheaterFormDataType } from "../commonComponentsOfOwner/TheaterForm";

interface TheaterOffDayFormProps {
  offDays: string[];
  setFormData: React.Dispatch<React.SetStateAction<TheaterFormDataType>>;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TheaterOffDayForm: React.FC<TheaterOffDayFormProps> = ({
  offDays,
  setFormData,
}) => {
  const toggleDay = (day: string) => {
    setFormData((prev) => {
      const updated = prev.offDays.includes(day)
        ? prev.offDays.filter((d) => d !== day)
        : [...prev.offDays, day];
      return { ...prev, offDays: updated };
    });
  };

  return (
    <Card>
      <CardContent className="space-y-2">
        <Label>Off Days</Label>
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={offDays.includes(day)}
              onChange={() => toggleDay(day)}
            />
            <Label>{day}</Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TheaterOffDayForm;
