"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TheaterFormDataType } from "../commonComponentsOfOwner/TheaterForm";

const languages = ["Hindi", "English", "Tamil", "Telugu", "Bengali"];
const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"];

type Props = {
  supportedLanguages: string[];
  supportedGenres: string[];
  setFormData: React.Dispatch<React.SetStateAction<TheaterFormDataType>>;
};

const TheaterSupportForm = ({
  supportedLanguages,
  supportedGenres,
  setFormData,
}: Props) => {
  const toggleCheckbox = (
    field: "supportedLanguages" | "supportedGenres",
    value: string
  ) => {
    setFormData((prev) => {
      const exists = prev[field].includes(value);
      const updated = exists
        ? prev[field].filter((v: string) => v !== value)
        : [...prev[field], value];
      return { ...prev, [field]: updated };
    });
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <Label className="block mb-2 font-semibold">
            Supported Languages
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <div key={lang} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={supportedLanguages.includes(lang)}
                  onChange={() => toggleCheckbox("supportedLanguages", lang)}
                />
                <Label>{lang}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="block mb-2 font-semibold">Supported Genres</Label>
          <div className="grid grid-cols-2 gap-2">
            {genres.map((genre) => (
              <div key={genre} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={supportedGenres.includes(genre)}
                  onChange={() => toggleCheckbox("supportedGenres", genre)}
                />
                <Label>{genre}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TheaterSupportForm;
