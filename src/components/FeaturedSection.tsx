"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

type FeaturedSectionProps = {
  headerTitle: string;
  feature?: string;
  navigateTo?: string;
};

const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  headerTitle,
  feature = "",
  navigateTo = "",
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-8 px-10 pt-10">
      <h3 className="text-2xl font-semibold">{headerTitle}</h3>
      {feature && navigateTo && (
        <p
          onClick={() => router.push(`/${navigateTo}`)}
          className="flex items-center gap-2 text-red-400 cursor-pointer"
        >
          {feature} <FaLongArrowAltRight />
        </p>
      )}
    </div>
  );
};

export default FeaturedSection;
