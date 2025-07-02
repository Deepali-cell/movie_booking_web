"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface TheaterBasicServiceFormProps {
  basicServices: string[];
  setBasicServices: (services: string[]) => void;
}

const TheaterBasicServiceForm: React.FC<TheaterBasicServiceFormProps> = ({
  basicServices,
  setBasicServices,
}) => {
  const handleChange = (value: string, idx: number) => {
    const updated = [...basicServices];
    updated[idx] = value;
    setBasicServices(updated);
  };

  const addService = () => {
    if (basicServices.some((service) => service.trim() === "")) return;
    setBasicServices([...basicServices, ""]);
  };

  const removeService = (idx: number) => {
    const updated = basicServices.filter((_, i) => i !== idx);
    setBasicServices(updated);
  };

  return (
    <Card>
      <CardContent className="space-y-2">
        <Label className="text-lg font-medium">Basic Services</Label>
        {basicServices.map((service, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input
              value={service}
              onChange={(e) => handleChange(e.target.value, idx)}
              onBlur={(e) => handleChange(e.target.value.trim(), idx)}
              placeholder={`Service ${idx + 1}`}
            />

            <Button
              type="button"
              variant="destructive"
              onClick={() => removeService(idx)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addService}>
          ➕ Add Service
        </Button>
      </CardContent>
    </Card>
  );
};

export default TheaterBasicServiceForm;
