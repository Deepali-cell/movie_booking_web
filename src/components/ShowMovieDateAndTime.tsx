"use client";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export interface ShowSlot {
  showId: string;
  time: string;
}

export interface ShowMovieDateAndTimeProps {
  id: string;
  dateTime: {
    [date: string]: ShowSlot[];
  };
}

const ShowMovieDateAndTime: React.FC<ShowMovieDateAndTimeProps> = ({
  dateTime,
  id,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const dates = Object.keys(dateTime);
  const navigate = useRouter();

  // ✅ useMemo to compute time only when both values are selected
  const time = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    const slot = dateTime[selectedDate]?.find((s) => s.showId === selectedTime);
    return slot ? dayjs(slot.time).format("h:mm A") : null;
  }, [selectedDate, selectedTime, dateTime]);

  const handleBookNow = () => {
    if (!selectedDate) {
      toast.error("Please select a day first!");
      return;
    }
    toast.success("Proceeding to booking...");
    const slot = dateTime[selectedDate]?.find((s) => s.showId === selectedTime);
    if (slot) {
      navigate.push(`/seatLayout/${id}/${selectedDate}/${slot.time}`);
    }
  };

  return (
    <div className="text-white px-4 py-6 max-w-4xl mx-auto">
      <div className="bg-[#1e1e2f] border border-gray-700 rounded-2xl p-6 shadow-lg space-y-6">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-center">
          Select Date & Time
        </h2>

        {/* Dates and Times */}
        <div className="space-y-4">
          {/* Dates */}
          <div className="overflow-x-auto flex gap-3 pb-2">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                className={`min-w-[120px] px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border ${
                  selectedDate === date
                    ? "bg-blue-600 border-blue-400 text-white"
                    : "bg-gray-800 border-gray-600 text-gray-300"
                } hover:bg-blue-500 hover:text-white transition`}
              >
                {dayjs(date).format("ddd, MMM D")}
              </button>
            ))}
          </div>

          {/* Times */}
          {selectedDate && (
            <div className="overflow-x-auto flex gap-3">
              {dateTime[selectedDate].map((slot) => (
                <button
                  key={slot.showId}
                  onClick={() => setSelectedTime(slot.showId)}
                  className={`min-w-[100px] px-4 py-2 rounded-md border text-sm font-semibold ${
                    selectedTime === slot.showId
                      ? "bg-green-600 border-green-400 text-white"
                      : "bg-gray-800 border-gray-600 text-gray-300"
                  } hover:bg-green-500 hover:text-white transition`}
                >
                  {dayjs(slot.time).format("h:mm A")}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Book Now Button & Selection Info */}
      <div className="flex justify-between items-center mt-8">
        <div className="text-sm text-gray-400">
          {selectedDate && selectedTime ? (
            <span>
              Selected: <strong>{dayjs(selectedDate).format("MMM D")}</strong>{" "}
              at <strong>{time}</strong>
            </span>
          ) : (
            <span>Select a show time to continue</span>
          )}
        </div>
        <button
          onClick={handleBookNow}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ShowMovieDateAndTime;
