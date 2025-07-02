"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TheaterType } from "@/lib/types";

type Props = {
  operatingHours: NonNullable<TheaterType["operatingHours"]>;
  setOperatingHours: (
    updated: NonNullable<TheaterType["operatingHours"]>
  ) => void;
  tier: TheaterType["tier"];
  setTier: (value: TheaterType["tier"]) => void;
  cancellationPolicy: NonNullable<TheaterType["cancellationPolicy"]>;
  setCancellationPolicy: (
    updated: NonNullable<TheaterType["cancellationPolicy"]>
  ) => void;
};

const tierOptions: TheaterType["tier"][] = [
  "normal",
  "premium",
  "luxury",
  "budget",
];

const TheaterOperationPolicyForm: React.FC<Props> = ({
  operatingHours,
  setOperatingHours,
  tier,
  setTier,
  cancellationPolicy,
  setCancellationPolicy,
}) => {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Open Time</Label>
          <Input
            type="text"
            placeholder="e.g., 09:00 AM"
            value={operatingHours.open ?? ""}
            onChange={(e) =>
              setOperatingHours({ ...operatingHours, open: e.target.value })
            }
          />

          <Label>Close Time</Label>
          <Input
            type="text"
            placeholder="e.g., 11:00 PM"
            value={operatingHours.close ?? ""}
            onChange={(e) =>
              setOperatingHours({ ...operatingHours, close: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Theater Tier</Label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as TheaterType["tier"])}
            className="border px-2 py-1 rounded w-full"
          >
            {tierOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={cancellationPolicy.refundable ?? false}
              onChange={(e) =>
                setCancellationPolicy({
                  ...cancellationPolicy,
                  refundable: e.target.checked,
                })
              }
            />
            <Label>Refundable</Label>
          </div>
          <Input
            type="number"
            placeholder="Refund Window (in hours)"
            value={cancellationPolicy.refundWindowInHours ?? 0}
            onChange={(e) =>
              setCancellationPolicy({
                ...cancellationPolicy,
                refundWindowInHours: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TheaterOperationPolicyForm;
