"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

// Step 1: Define allowed screen types
const screenTypes = ["Normal", "3D", "IMAX"] as const;
type ScreenType = (typeof screenTypes)[number];

type Screen = {
  name: string;
  capacity: number;
  type: ScreenType;
};

type Props = {
  screens: Screen[];
  setScreens: (screens: Screen[]) => void;
};

const TheaterScreensForm: React.FC<Props> = ({ screens, setScreens }) => {
  const handleScreenChange = (
    idx: number,
    key: keyof Screen,
    value: string | number
  ) => {
    const updated = [...screens];
    if (key === "capacity") {
      updated[idx][key] = Number(value) as Screen["capacity"];
    } else if (key === "type") {
      updated[idx][key] = value as ScreenType;
    } else {
      updated[idx][key] = value as string;
    }
    setScreens(updated);
  };

  const addScreen = () => {
    setScreens([...screens, { name: "", capacity: 0, type: "Normal" }]);
  };

  const removeScreen = (idx: number) => {
    const updated = screens.filter((_, i) => i !== idx);
    setScreens(updated);
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <Label className="text-lg font-semibold">Screens</Label>
        {screens.map((screen, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-4 items-center">
            <Input
              placeholder="Screen Name"
              value={screen.name}
              onChange={(e) => handleScreenChange(idx, "name", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Capacity"
              value={Number.isNaN(screen.capacity) ? "" : screen.capacity}
              onChange={(e) =>
                handleScreenChange(
                  idx,
                  "capacity",
                  parseInt(e.target.value || "0")
                )
              }
            />

            <select
              value={screen.type}
              onChange={(e) =>
                handleScreenChange(idx, "type", e.target.value as ScreenType)
              }
              className="border px-2 py-2 rounded-md"
            >
              {screenTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeScreen(idx)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addScreen}>
          ➕ Add Screen
        </Button>
      </CardContent>
    </Card>
  );
};

export default TheaterScreensForm;
