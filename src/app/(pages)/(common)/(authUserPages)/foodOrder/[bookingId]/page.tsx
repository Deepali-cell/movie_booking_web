"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, AlertTriangle } from "lucide-react";
import MenuSection from "@/components/common/bookingSection/MenuSection";
import { FoodCourtType } from "@/lib/types";

const FoodCourtsPage = () => {
  const searchParams = useSearchParams();
  const block = searchParams.get("blockName") || ""; // convert null to ""
  const theaterId = searchParams.get("theaterId") || "";
  const action = searchParams.get("action") || "";

  const [foodCourts, setFoodCourts] = useState<FoodCourtType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourt, setSelectedCourt] = useState<FoodCourtType | null>(
    null
  );

  useEffect(() => {
    const fetchFoodCourts = async () => {
      try {
        const res = await axios.get(
          `/api/owner/fetchFoodCourtList?theaterId=${theaterId}&block=${block}`
        );
        setFoodCourts(res.data?.foodCourtList || []);
      } catch (err) {
        console.error("Failed to fetch food courts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodCourts();
  }, [theaterId, block]);

  if (loading) {
    return (
      <div className="text-center pt-20 text-white">Loading food courts...</div>
    );
  }

  return (
    <div className="pt-20 px-4 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">🍽️ Choose a Food Court</h1>

      {foodCourts.length === 0 ? (
        <p className="text-gray-400 text-lg">
          ❌ No food courts available for this location.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodCourts.map((court) => (
            <Card
              key={court._id}
              className="bg-[#121212] border border-white/10 shadow-lg rounded-xl overflow-hidden text-white"
            >
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold mb-2">🏬 {court.name}</h2>
                <p className="mb-1 text-gray-300">
                  🧱 Block:{" "}
                  <span className="text-white">
                    {court.location?.block ?? "N/A"}
                  </span>
                </p>
                <p className="mb-1 text-gray-300">
                  🪜 Floor:{" "}
                  <span className="text-white">
                    {court.location?.floor ?? "N/A"}
                  </span>
                </p>

                <div className="mt-4 mb-2 text-sm text-gray-400">
                  <Utensils className="inline mr-1 text-yellow-400" size={16} />
                  Delivery Type:
                  <span className="font-medium text-white">
                    {court.foodService?.deliveryType === "in-seat"
                      ? "In-seat Delivery"
                      : "Self Service"}
                  </span>
                </div>
                {action === "preOrder" && (
                  <div className="mt-4 mb-2 text-sm text-gray-400">
                    <span className="font-medium text-white">
                      No Seat Delivery for Pre-orders. You must collect order
                      before show.
                    </span>
                  </div>
                )}
                <div className="mb-2 text-sm text-gray-400">
                  <AlertTriangle
                    className="inline mr-1 text-red-400"
                    size={16}
                  />
                  Allergy Note Allowed:{" "}
                  {court.foodService?.allowsAllergyNote ? "Yes" : "No"}
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setSelectedCourt(court)}
                  >
                    🍔 View Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Render Menu */}
      {selectedCourt && (
        <MenuSection
          court={selectedCourt}
          onClose={() => setSelectedCourt(null)}
          theaterId={theaterId}
          block={block}
          action={action}
        />
      )}
    </div>
  );
};

export default FoodCourtsPage;
