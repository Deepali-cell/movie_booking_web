import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

type Props = {
  formData: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

export default function TheaterLocationForm({
  formData,
  handleChange,
  setFormData,
}: Props) {
  return (
    <Card>
      <CardContent className="space-y-2">
        {Object.keys(formData.location).map((key) =>
          Array.isArray(formData.location[key]) ? (
            formData.location[key].map((item: string, idx: number) => (
              <Input
                key={idx}
                placeholder={`Landmark ${idx + 1}`}
                value={item}
                onChange={(e) => {
                  const updated = [...formData.location.landmarks];
                  updated[idx] = e.target.value;
                  setFormData((prev: any) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      landmarks: updated,
                    },
                  }));
                }}
              />
            ))
          ) : (
            <Input
              key={key}
              placeholder={key}
              value={formData.location[key]}
              onChange={(e) => handleChange(e, `location.${key}`)}
            />
          )
        )}
      </CardContent>
    </Card>
  );
}
