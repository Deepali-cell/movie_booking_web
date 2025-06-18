import React from "react";
import Image from "next/image";

const MiniTrailors = ({ trailers, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {trailers.map((trailer, index) => (
        <div
          key={index}
          className="w-32 h-20 rounded overflow-hidden cursor-pointer hover:scale-105 transition"
          onClick={() => onSelect(trailer)}
        >
          <Image
            src={trailer.image}
            alt={`Trailer ${index}`}
            width={128}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};

export default MiniTrailors;
