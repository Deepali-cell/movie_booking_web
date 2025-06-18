"use client";
import React, { useEffect, useRef, useState } from "react";
import { dummyDateTimeData, dummyShowsData } from "@/assets/assets";
import Image from "next/image";
import { timeFormat } from "@/lib/utils";
import {
  CalendarDays,
  Clock,
  Languages,
  Star,
  Film,
  BadgeInfo,
  Sparkles,
} from "lucide-react";
import { FaPlay } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import MovieCastShow from "./MovieCastShow";
import ShowMovieDateAndTime from "./ShowMovieDateAndTime";
import FeaturedSection from "./FeaturedSection";
import AllMovies from "./AllMovies";
import LoadingScreen from "./LoadingScreen";

const ShowMovieDetail = ({ movieId }: { movieId: string }) => {
  const [show, setShow] = useState(null);
  const dateTimeRef = useRef<HTMLDivElement | null>(null);

  const getShow = () => {
    const movie = dummyShowsData.find((movie) => movie._id === movieId);
    setShow({ movie, dateTime: dummyDateTimeData });
  };

  useEffect(() => {
    getShow();
  }, [movieId]);

  if (!show || !show.movie) {
    return <LoadingScreen />;
  }

  const { movie, dateTime } = show;
  const scrollToDateTime = () => {
    if (dateTimeRef.current) {
      dateTimeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      {/* Movie Title */}
      <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
        <Film className="w-8 h-8 text-yellow-400" />
        {movie.title}
      </h1>

      {movie.tagline && (
        <p className="italic text-lg text-gray-300 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-400" />"{movie.tagline}"
        </p>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Poster Image */}
        <div className="w-full md:w-1/3">
          <Image
            src={movie.poster_path}
            alt={movie.title}
            width={400}
            height={600}
            className="rounded-lg shadow-xl object-cover"
          />
        </div>

        {/* Movie Details */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BadgeInfo className="w-6 h-6 text-blue-400" />
            Overview
          </h2>
          <p className="text-gray-200">{movie.overview}</p>

          <div>
            <h3 className="font-medium text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Genres
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 rounded-full border border-gray-400 text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-2 items-center">
              <CalendarDays className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-medium">Release Date:</p>
                <p>{movie.release_date}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Clock className="w-5 h-5 text-yellow-300" />
              <div>
                <p className="font-medium">Runtime:</p>
                <p>{timeFormat({ time: movie.runtime })}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Languages className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="font-medium">Language:</p>
                <p>{movie.original_language.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Star className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="font-medium">Rating:</p>
                <p>
                  {movie.vote_average} ({movie.vote_count.toLocaleString()}{" "}
                  votes)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-baseline gap-4">
            <button className="bg-transparent border border-white text-white px-4 py-1.5 rounded-md transition flex items-center gap-2 text-sm">
              <FaPlay />
              Watch Trailer
            </button>
            <button
              onClick={scrollToDateTime}
              className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition flex items-center gap-2 text-sm"
            >
              Buy Tickets
            </button>
            <button className="border border-white rounded-full p-1">
              <CiHeart size={30} />
            </button>
          </div>
        </div>
      </div>

      {/* Cast & DateTime */}
      <MovieCastShow casts={movie.casts} />
      {/* 🎯 Scroll Target */}
      <div ref={dateTimeRef}>
        <ShowMovieDateAndTime dateTime={dateTime} id={movieId} />
      </div>
      <div>
        <FeaturedSection headerTitle={"Related Movie"} />
        <AllMovies
          dummyShowsData={dummyShowsData.slice(0, 3)}
          showMore={true}
        />
      </div>
    </div>
  );
};

export default ShowMovieDetail;
