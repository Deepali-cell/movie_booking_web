"use client";

import React from "react";
import { FoodCourtType } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface FoodCourtCardProps {
  fc: FoodCourtType;
  onEdit: () => void;
  onDelete: () => void;
  onEditItem: (foodCourtId: string, item: any) => void;
  onDeleteItem: (foodCourtId: string, item: any) => void;
}

const FoodCourtCard: React.FC<FoodCourtCardProps> = ({
  fc,
  onEdit,
  onDelete,
  onEditItem,
  onDeleteItem,
}) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">{fc.name}</h2>
      <p className="mb-2">
        📍 Block: <strong>{fc.location.block ?? "N/A"}</strong>, Floor:{" "}
        <strong>{fc.location.floor ?? "N/A"}</strong>
      </p>
      <p className="mb-2">🧾 Delivery Type: {fc.foodService.deliveryType}</p>
      <p className="mb-4">🥗 Items: {fc.foodMenu.length}</p>

      <div className="flex gap-2 mb-2">
        <Button onClick={onEdit}>Edit Food Court</Button>
        <Button onClick={onDelete} variant="destructive">
          Delete
        </Button>
      </div>

      {fc.foodMenu.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Menu Items:</h4>
          <ul className="space-y-1">
            {fc.foodMenu.map((item) => (
              <li key={item._id} className="flex justify-between items-center">
                <span>
                  {item.name} - ₹{item.price}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onEditItem(fc._id, item)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteItem(fc._id, item)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FoodCourtCard;
