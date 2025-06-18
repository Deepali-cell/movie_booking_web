"use client";
import { dummyBookingData } from "@/assets/assets";
import AdminFeaturedSection from "@/components/adminComponents/AdminFeaturedSection";
import BookingList from "@/components/adminComponents/BookingList";
import React, { useEffect, useState } from "react";

const page = () => {
  const [bookingList, setbookingList] = useState([]);
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

export default page;
