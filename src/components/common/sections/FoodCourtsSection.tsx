"use client";
import React from "react";
import Loading from "../Loading";
import { FoodCourtType, FoodItemType } from "@/lib/types";
import Image from "next/image";
import CustomReview from "@/components/reviewComponents/CustomReview";
import ShowReview from "@/components/reviewComponents/ShowReview";

const FoodCourtsSection = ({ foodCourts }: { foodCourts: FoodCourtType[] }) => {
  if (!foodCourts) return <Loading />;
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">🍔 Food Courts</h2>
      {foodCourts.map((fc) => (
        <div
          key={fc._id}
          className="bg-gray-900 rounded-2xl p-6 shadow-lg mb-10"
        >
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{fc.name}</h3>
            <p className="text-sm text-gray-400">
              📍 Block: {fc.location.block}, Floor: {fc.location.floor}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              🛎️ Service: {fc.foodService.deliveryType.replace("-", " ")} |{" "}
              {fc.foodService.allowsAllergyNote
                ? "✅ Allergy notes accepted"
                : "❌ No allergy notes"}
            </p>
          </div>

          {/* Food Menu */}
          <div className="grid md:grid-cols-3 gap-6 mt-4">
            {fc.foodMenu.map((item: FoodItemType) => (
              <div
                key={item._id}
                className="bg-gray-800 rounded-xl p-4 shadow-md"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={400}
                  height={128}
                  className="h-32 w-full object-cover rounded-md mb-3"
                  style={{ objectFit: "cover" }}
                />
                <h4 className="text-lg font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-400 capitalize">
                  🍽️ {item.type}
                </p>
                <p className="text-sm mt-1">
                  {item.isVegetarian ? "🌱 Vegetarian" : "🍗 Non-Vegetarian"}{" "}
                  {item.isVegan && " | 🥦 Vegan"}
                </p>
                <p className="mt-2 text-green-400 font-semibold">
                  ₹{item.price}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            {/* Add review form */}
            <CustomReview type="foodcourt" id={fc._id} />

            {/* Show reviews */}
            <h3 className="text-xl font-semibold mt-8 mb-4 text-white">
              📝 Customer Reviews
            </h3>
            <ShowReview reviews={fc.foodService.orderReviews} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodCourtsSection;
