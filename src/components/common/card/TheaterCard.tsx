"use client";

import { TheaterType } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface TheaterCardProps {
  theater: TheaterType;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const TheaterCard: React.FC<TheaterCardProps> = ({
  theater,
  isSelected = false,
  onSelect,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/theater/${theater._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer border rounded-xl overflow-hidden shadow hover:shadow-lg transition
        ${
          isSelected
            ? "bg-green-600 border-green-400"
            : "bg-gray-900 border-gray-700"
        }
      `}
    >
      {/* If onSelect is provided, show checkbox */}
      {onSelect && (
        <div className="absolute top-2 right-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(theater._id)}
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 accent-green-500 cursor-pointer"
          />
        </div>
      )}

      <div className="relative w-full h-48">
        <Image
          src={theater.image}
          alt={theater.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw,
                   (max-width: 1200px) 50vw,
                   33vw"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-1">{theater.name}</h2>
        <p className="text-sm text-gray-400">
          {theater.location?.city}, {theater.location?.state},{" "}
          {theater.location?.country}
        </p>
      </div>
    </div>
  );
};

export default TheaterCard;
