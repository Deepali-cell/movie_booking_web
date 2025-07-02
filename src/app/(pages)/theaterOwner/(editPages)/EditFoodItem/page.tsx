import EditFoodItem from "@/components/ownerComponents/addcomponents/EditFoodItem";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <EditFoodItem />
    </Suspense>
  );
}
