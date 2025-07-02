import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React from "react";
import { TheaterFormDataType } from "../commonComponentsOfOwner/TheaterForm";

type Props = {
  formData: TheaterFormDataType;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof TheaterFormDataType
  ) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TheaterBasicInfoForm({
  formData,
  handleChange,
  handleImageUpload,
}: Props) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <Label>Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => handleChange(e, "name")}
        />

        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange(e, "description")}
        />

        <Label>Image</Label>
        <Input type="file" accept="image/*" onChange={handleImageUpload} />

        {formData.image && (
          <Image
            src={formData.image}
            alt="preview"
            width={400}
            height={300}
            className="rounded"
          />
        )}
      </CardContent>
    </Card>
  );
}
