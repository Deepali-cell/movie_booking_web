"use client";
import { dummyBookingData } from "@/assets/assets";
import AdminFeaturedSection from "@/components/adminComponents/AdminFeaturedSection";
import BookingList from "@/components/adminComponents/BookingList";
import { Booking } from "@/lib/types";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [bookingList, setbookingList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const getList = () => {
    try {
      setbookingList(dummyBookingData);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching booking list:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <AdminFeaturedSection headerTitle="Booking List" />
      <BookingList list={bookingList} loading={loading} />
    </div>
  );
};

export default Page;
