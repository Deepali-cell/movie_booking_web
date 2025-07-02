"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TheaterType } from "@/lib/types";

interface Props {
  theater: TheaterType;
  onEdit: () => void;
  onDelete: () => void;
}

const TheaterCard: React.FC<Props> = ({ theater, onEdit, onDelete }) => {
  return (
    <div className="bg-black border border-white rounded-2xl shadow-lg text-white p-6 max-w-5xl mx-auto my-6">
      <div className="mb-4">
        <h2 className="text-3xl font-bold">{theater.name}</h2>
        <p className="text-sm italic text-gray-300">{theater.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative w-full h-60">
          <Image
            src={theater.image}
            alt="Theater"
            fill
            className="object-cover rounded-xl border border-gray-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Owner ID:</strong> {theater._id}
          </p>
          <p>
            <strong>City:</strong> {theater.location?.city},{" "}
            {theater.location?.state}, {theater.location?.country} -{" "}
            {theater.location?.pincode}
          </p>
          <p>
            <strong>Address:</strong> {theater.location?.addressLine}
          </p>
          <p>
            <strong>Landmarks:</strong>{" "}
            {theater.location?.landmarks?.join(", ")}
          </p>

          <p>
            <strong>Contact:</strong>
          </p>
          <ul className="ml-4 list-disc">
            <li>📞 {theater.contact?.phone}</li>
            <li>📧 {theater.contact?.email}</li>
            <li>🌐 {theater.contact?.website}</li>
          </ul>

          <p>
            <strong>Basic Services:</strong> {theater.basicServices?.join(", ")}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="font-semibold mb-2">🎬 Screens:</p>
        {theater.screens?.map((screen, idx) => (
          <div key={idx} className="ml-4 text-sm">
            ▶️ <strong>{screen.name}</strong> | Type: {screen.type} | Capacity:{" "}
            {screen.capacity}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="font-semibold">🧩 Facilities:</p>
        <ul className="ml-4 list-disc text-sm">
          {theater.facilities?.map((fac, i) => (
            <li key={i}>
              {fac.type.join(", ")} | For: {fac.forCategory?.join(", ")} | Near:{" "}
              {fac.location?.near || "N/A"}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
        <div>
          <p>
            <strong>Supported Genres:</strong>{" "}
            {theater.supportedGenres?.join(", ")}
          </p>
          <p>
            <strong>Languages:</strong> {theater.supportedLanguages?.join(", ")}
          </p>
          <p>
            <strong>Operating Hours:</strong> {theater.operatingHours?.open} -{" "}
            {theater.operatingHours?.close}
          </p>
          <p>
            <strong>Off Days:</strong> {theater.offDays?.join(", ") || "None"}
          </p>
        </div>
        <div>
          <p>
            <strong>🎭 All Movies:</strong> {theater.allMovies?.length}
          </p>
          <p>
            <strong>🎬 Movies Playing:</strong> {theater.moviesPlaying?.length}
          </p>
          <p>
            <strong>🍽️ Food Courts:</strong> {theater.foodCourts?.length}
          </p>
          <p>
            <strong>Blocks:</strong> {theater.blocks?.length}
          </p>
        </div>
      </div>

      <div className="mt-6 text-sm">
        <p>
          <strong>⭐ Ratings:</strong> Cleaning:{" "}
          {theater.ratings?.cleaningRating} | Total:{" "}
          {theater.ratings?.totalRatings}
        </p>
        <p>
          <strong>Reviews:</strong>
        </p>
        {theater.reviews?.map((rev, i) => (
          <div key={i} className="ml-4 italic text-gray-300">
            {rev.comment} - {rev.userName} ⭐ {rev.rating}
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm">
        <p>
          <strong>Tier:</strong> {theater.tier}
        </p>
        <p>
          <strong>Cancellation Policy:</strong>{" "}
          {theater.cancellationPolicy?.refundable
            ? "Refundable"
            : "Non-refundable"}{" "}
          | Within {theater.cancellationPolicy?.refundWindowInHours} hours
        </p>
      </div>

      <div className="mt-6">
        <p className="font-semibold text-lg mb-2">🎯 Blocks Info:</p>
        {theater.blocks?.map((block, i) => (
          <div
            key={i}
            className="ml-4 mb-4 text-sm border-l pl-4 border-gray-700"
          >
            <p>
              🧱 <strong>{block.name}</strong> | Screen Type: {block.screen}
            </p>
            <p>
              🎬 Movies: {block.movies?.length}{" "}
              {block.movies?.length > 0 && (
                <span>
                  (
                  {block.movies.map((show, idx2) => (
                    <span key={typeof show === "string" ? show : show._id}>
                      {typeof show === "string"
                        ? "ID: " + show
                        : show.movie?.title || "Untitled"}
                      {idx2 < block.movies.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  )
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={onDelete}
        >
          Delete
        </Button>
        <Button
          className="bg-white text-black hover:bg-gray-200"
          onClick={onEdit}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default TheaterCard;
