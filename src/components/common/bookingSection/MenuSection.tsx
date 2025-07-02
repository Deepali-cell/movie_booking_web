"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import OrderModal from "./OrderModal";
import { FoodCourtType } from "@/lib/types";

interface FoodItem {
  name: string;
  type: string;
  price: number;
  isVegetarian: boolean;
  image?: string;
}

interface Court {
  _id: string;
  name: string;
  foodMenu: FoodItem[];
  foodService?: {
    allowsAllergyNote?: boolean;
  };
}

interface CartItem {
  quantity: number;
  note: string;
}

interface Props {
  court: FoodCourtType;
  onClose: () => void;
  theaterId: string;
  block: string;
  action: string;
}

const MenuSection: React.FC<Props> = ({
  court,
  onClose,
  theaterId,
  block,
  action,
}) => {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [showModal, setShowModal] = useState(false);

  const handleQtyChange = (itemName: string, delta: number) => {
    setCart((prev) => {
      const item = prev[itemName] || { quantity: 0, note: "" };
      const newQty = Math.max(0, item.quantity + delta);
      return {
        ...prev,
        [itemName]: { ...item, quantity: newQty },
      };
    });
  };

  const handleNoteChange = (itemName: string, note: string) => {
    setCart((prev) => ({
      ...prev,
      [itemName]: { ...prev[itemName], note },
    }));
  };

  const handlePlaceOrder = () => {
    setShowModal(true);
  };

  const selectedItems = Object.entries(cart)
    .filter(([_, item]) => item.quantity > 0)
    .map(([name, item]) => {
      const menuItem = court.foodMenu.find((i) => i.name === name);
      return {
        name,
        quantity: item.quantity,
        price: (menuItem?.price ?? 0) * item.quantity,
        allergyNote: item.note,
      };
    });

  const totalAmount = selectedItems.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="mt-10 p-6 bg-[#1a1a1a] rounded-xl border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Menu - {court.name}</h2>
        <button className="text-sm text-red-400 underline" onClick={onClose}>
          Close Menu
        </button>
      </div>

      {court.foodMenu?.length === 0 ? (
        <p className="text-gray-400">No items available.</p>
      ) : (
        court.foodMenu.map((item, idx) => {
          const cartItem = cart[item.name] || { quantity: 0, note: "" };
          return (
            <div
              key={idx}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 border-b border-white/10 pb-4"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-400 capitalize">{item.type}</p>
                <p className="text-sm text-gray-300">
                  ₹{item.price} | {item.isVegetarian ? "🥦 Veg" : "🍗 Non-Veg"}
                </p>
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={60}
                    className="rounded mt-2"
                  />
                )}

                {court.foodService?.allowsAllergyNote && (
                  <input
                    placeholder="Add allergy note"
                    value={cartItem.note}
                    onChange={(e) =>
                      handleNoteChange(item.name, e.target.value)
                    }
                    className="mt-2 px-2 py-1 rounded bg-black text-white border border-white/20 text-sm w-full sm:w-64"
                  />
                )}
              </div>

              <div className="flex items-center mt-3 sm:mt-0">
                <button
                  className="px-3 py-1 bg-white text-black rounded-l"
                  onClick={() => handleQtyChange(item.name, -1)}
                >
                  −
                </button>
                <span className="px-4 bg-white text-black">
                  {cartItem.quantity}
                </span>
                <button
                  className="px-3 py-1 bg-white text-black rounded-r"
                  onClick={() => handleQtyChange(item.name, 1)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })
      )}

      {selectedItems.length > 0 && (
        <div className="mt-6 text-right">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handlePlaceOrder}
          >
            Place Order (₹{totalAmount})
          </Button>
        </div>
      )}

      {showModal && (
        <OrderModal
          action={action}
          onClose={() => setShowModal(false)}
          orderData={{
            userDetail: { name: "", seat: "", block },
            theaterId,
            foodCourtId: court._id,
            items: selectedItems,
            totalAmount,
          }}
        />
      )}
    </div>
  );
};

export default MenuSection;
