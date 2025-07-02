"use client";
import React from "react";
import HeroSection from "@/components/common/HeroSection";
import AllTheaters from "@/components/common/AllTheaters";
import { useStateContext } from "@/context/StateContextProvider";

const Page = () => {
  const { alltheaterList } = useStateContext();
  return (
    <>
      <HeroSection />
      <AllTheaters alltheaterList={alltheaterList} />
    </>
  );
};

export default Page;
