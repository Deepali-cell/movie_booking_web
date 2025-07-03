"use client";

import CustomReview from "@/components/reviewComponents/CustomReview";
import ShowReview from "@/components/reviewComponents/ShowReview";
import { TheaterType } from "@/lib/types";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const TheaterInfo = ({ theater }: { theater: TheaterType }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `/api/review/getReview?type=theater&id=${theater._id}`
        );
        setReviews(res.data.reviews);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };

    fetchReviews();
  }, [theater._id]);
  return (
    <div className="bg-black rounded-2xl shadow-lg text-white p-6 max-w-5xl mx-auto my-6">
      <div className="mb-4">
        <h2 className="text-3xl font-bold">{theater.name}</h2>
        <p className="text-sm italic text-gray-300">{theater.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative w-full h-60 rounded-xl overflow-hidden shadow">
          <Image
            src={theater.image}
            alt="Theater"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-2">
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
            {(theater.location?.landmarks ?? []).join(", ") || "N/A"}
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
            <strong>Basic Services:</strong>{" "}
            {(theater.basicServices ?? []).join(", ") || "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="font-semibold mb-2">🎬 Screens:</p>
        {(theater.screens ?? []).map((screen, idx) => (
          <div key={idx} className="ml-4 text-sm">
            ▶️ <strong>{screen.name}</strong> | Type: {screen.type} | Capacity:{" "}
            {screen.capacity}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="font-semibold">🧩 Facilities:</p>
        <ul className="ml-4 list-disc text-sm">
          {(theater.facilities ?? []).length > 0 ? (
            theater.facilities.map((fac, i) => (
              <li key={i}>
                {(fac.type ?? []).join(", ")} | For:{" "}
                {(fac.forCategory ?? []).join(", ")} | Near:{" "}
                {fac.location?.near || "N/A"}
              </li>
            ))
          ) : (
            <li className="italic text-gray-400">No facilities listed.</li>
          )}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
        <div>
          <p>
            <strong>Supported Genres:</strong>{" "}
            {(theater.supportedGenres ?? []).join(", ")}
          </p>
          <p>
            <strong>Languages:</strong>{" "}
            {(theater.supportedLanguages ?? []).join(", ")}
          </p>
          <p>
            <strong>Operating Hours:</strong> {theater.operatingHours?.open} -{" "}
            {theater.operatingHours?.close}
          </p>
          <p>
            <strong>Off Days:</strong>{" "}
            {(theater.offDays ?? []).join(", ") || "None"}
          </p>
        </div>
        <div>
          <p>
            <strong>🎭 All Movies:</strong> {theater.allMovies?.length ?? 0}
          </p>
          <p>
            <strong>🎬 Movies Playing:</strong>{" "}
            {theater.moviesPlaying?.length ?? 0}
          </p>
          <p>
            <strong>🍽️ Food Courts:</strong> {theater.foodCourts?.length ?? 0}
          </p>
          <p>
            <strong>Blocks:</strong> {theater.blocks?.length ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-6 text-sm">
        <p>
          <strong>⭐ Ratings:</strong> Cleaning:{" "}
          {theater.ratings?.cleaningRating ?? "-"} | Total:{" "}
          {theater.ratings?.totalRatings ?? 0}
        </p>
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
        {(theater.blocks ?? []).map((block, i) => (
          <div key={i} className="ml-4 mb-4 text-sm">
            <p>
              🧱 <strong>{block.name}</strong> | Screen Type: {block.screen}
            </p>
            <p>
              🎬 Movies: {(block.movies ?? []).length}
              {(block.movies ?? []).length > 0 && (
                <span>
                  {" ("}
                  {(block.movies as any[]).map((show, idx) => (
                    <span key={show._id}>
                      {show.movie?.title || "Untitled"}
                      {idx < (block.movies as any[]).length - 1 ? ", " : ""}
                    </span>
                  ))}
                  {")"}
                </span>
              )}
            </p>
          </div>
        ))}

        <div className="mt-6 text-sm">
          <CustomReview type="theater" id={theater._id} />

          <ShowReview reviews={theater.reviews} />
        </div>
      </div>
    </div>
  );
};

export default TheaterInfo;
