import Image from "next/image";
import React from "react";
import FeaturedSection from "./FeaturedSection";
import { Cast } from "@/lib/types";

export interface MovieCastShowProps {
  casts: Cast[];
}

const MovieCastShow: React.FC<MovieCastShowProps> = ({ casts }) => {
  return (
    <div className="p-6">
      <FeaturedSection headerTitle="Movie Cast" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {casts.slice(0, 10).map((cast, index) => (
          <div key={index} className="flex flex-col items-center">
            <Image
              src={cast.profile_path}
              alt={cast.name}
              height={48}
              width={48}
              className="object-cover rounded-full border-white "
            />
            <p className="text-sm font-medium text-center">{cast.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieCastShow;
