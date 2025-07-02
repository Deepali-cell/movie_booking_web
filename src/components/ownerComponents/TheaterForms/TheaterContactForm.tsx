// components/theater-forms/TheaterContactForm.tsx
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

type Props = {
  formData: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string
  ) => void;
};

export default function TheaterContactForm({ formData, handleChange }: Props) {
  return (
    <Card>
      <CardContent className="space-y-2">
        {Object.keys(formData.contact).map((key) => (
          <Input
            key={key}
            placeholder={key}
            value={formData.contact[key]}
            onChange={(e) => handleChange(e, `contact.${key}`)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
