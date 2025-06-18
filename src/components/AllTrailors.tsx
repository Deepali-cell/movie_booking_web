"use client";
import React, { useState } from "react";
import MiniTrailors from "./MiniTrailors";
import FeaturedSection from "./FeaturedSection";
import { dummyTrailers } from "@/assets/assets";

const AllTrailors = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  // Filter out the current trailer from the mini trailers
  const miniTrailers = dummyTrailers.filter(
    (trailer) => trailer.videoUrl !== currentTrailer.videoUrl
  );

  return (
    <div className="p-6">
      <FeaturedSection headerTitle={"Trailors"} />
      <div className="flex flex-col items-center space-y-10">
        {/* Main Trailer */}
        <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-2xl">
          <iframe
            className="w-full h-full"
            src={currentTrailer.videoUrl.replace("watch?v=", "embed/")}
            title="Trailer"
            allowFullScreen
          />
        </div>

        {/* Mini Trailers */}
        <MiniTrailors trailers={miniTrailers} onSelect={setCurrentTrailer} />
      </div>
    </div>
  );
};

export default AllTrailors;
