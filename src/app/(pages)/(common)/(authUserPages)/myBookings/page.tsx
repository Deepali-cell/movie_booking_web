"use client";
import BookingList from "@/components/common/BookingList";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [bookingList, setBookingList] = useState();

  const fetchBookingList = async () => {
    try {
      const { data } = await axios.get("/api/getBookingByUserId");
      if (data.success) {
        setBookingList(data.bookingList);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("frontend error while fetching the booking list of the user");
    }
  };

  useEffect(() => {
    fetchBookingList();
  }, []);

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-[#121212]">
      <main className="flex-grow">
        <BookingList bookingList={bookingList} />
      </main>
    </div>
  );
};

export default Page;
