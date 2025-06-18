"use client";
import React from "react";
import bgImage from "@/assets/backgroundImage.png";
import { GiNotebook } from "react-icons/gi";
import { GoStopwatch } from "react-icons/go";
import { FaLongArrowAltRight } from "react-icons/fa";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const navigate = useRouter();
  return (
    <>
      <div className="w-full">
        {/* Hero Section with Full-Screen Background */}
        <div className="relative w-full h-screen">
          <Image
            src={bgImage}
            alt="Background"
            fill
            className="object-cover"
            priority
          />

          <div className="relative z-10 w-full h-full pt-[120px] px-6 md:px-16 text-white flex items-center">
            <div className="max-w-2xl space-y-6">
              <Image src={assets.marvelLogo} alt="Marvel Logo" />

              <h1 className="text-4xl font-bold">Guardians of the Galaxy</h1>

              <p className="flex items-center gap-4 text-lg">
                Action | Adventure | Sci-Fi
                <span className="flex items-center gap-1">
                  <GiNotebook /> 2018
                </span>
                <span className="flex items-center gap-1">
                  <GoStopwatch /> 2h 8m
                </span>
              </p>

              <p className="text-base">
                In a post-apocalyptic world where cities ride on wheels and
                consume each other to survive, two people meet in London and try
                to stop a conspiracy.
              </p>

              <button
                onClick={() => navigate.push("/movies")}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-md"
              >
                Explore <FaLongArrowAltRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
