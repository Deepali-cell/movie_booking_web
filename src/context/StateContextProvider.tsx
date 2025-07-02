"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import {
  BlockType,
  BookingType,
  FoodCourtType,
  MovieType,
  TheaterType,
  UserType,
} from "@/lib/types";

type StateContextType = {
  user: UserType | undefined;
  role: string | undefined;
  isSignedIn: boolean;
  isLoaded: boolean;
  theaterList: TheaterType[];
  settheaterList: React.Dispatch<React.SetStateAction<TheaterType[]>>;
  alltheaterList: TheaterType[];
  setalltheaterList: React.Dispatch<React.SetStateAction<TheaterType[]>>;
  blocks: BlockType[];
  setBlocks: React.Dispatch<React.SetStateAction<BlockType[]>>;
  fetchBlocks: (theaterId: string) => Promise<void>;
  foodCourts: FoodCourtType[];
  setFoodCourts: React.Dispatch<React.SetStateAction<FoodCourtType[]>>;
  fetchFoodCourts: (theaterId: string, blockName?: string) => Promise<void>;
  movies: MovieType[];
  setMovies: React.Dispatch<React.SetStateAction<MovieType[]>>;
  fetchMovies: (theaterId: string) => Promise<void>;
  selectedTheaterId: string | null;
  setSelectedTheaterId: React.Dispatch<React.SetStateAction<string | null>>;
  bookings: BookingType[];
  setBookings: React.Dispatch<React.SetStateAction<BookingType[]>>;
  fetchBookingsList: (theaterId: string) => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
};

const StateContext = createContext<StateContextType>({
  user: undefined,
  role: undefined,
  isSignedIn: false,
  isLoaded: false,
  theaterList: [],
  settheaterList: () => {},
  alltheaterList: [],
  setalltheaterList: () => {},
  blocks: [],
  setBlocks: () => {},
  fetchBlocks: async () => {},
  foodCourts: [],
  setFoodCourts: () => {},
  fetchFoodCourts: async () => {},
  movies: [],
  setMovies: () => {},
  fetchMovies: async () => {},
  selectedTheaterId: null,
  setSelectedTheaterId: () => {},
  bookings: [],
  setBookings: () => {},
  fetchBookingsList: async () => {},
  uploadFile: async () => "",
});

export const StateContextProvider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();

  const user: UserType | undefined = clerkUser
    ? {
        _id: clerkUser.id,
        name: clerkUser.fullName || "",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        image: clerkUser.imageUrl || "",
        phoneNumber: clerkUser.primaryPhoneNumber?.phoneNumber || "",
        role: clerkUser.publicMetadata?.role as "user" | "owner" | "admin",
        createdAt: "", // adjust this if you save createdAt somewhere
      }
    : undefined;

  const role = user?.role;
  // ✅ Strictly typed states
  const [theaterList, settheaterList] = useState<TheaterType[]>([]);
  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(
    null
  );
  const [alltheaterList, setalltheaterList] = useState<TheaterType[]>([]);
  const [blocks, setBlocks] = useState<BlockType[]>([]);
  const [foodCourts, setFoodCourts] = useState<FoodCourtType[]>([]);
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [bookings, setBookings] = useState<BookingType[]>([]);

  const fetchTheatersList = async () => {
    try {
      const { data } = await axios.get("/api/owner/fetchTheatersList");
      if (data.success) {
        settheaterList(data.list);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("❌ Frontend error while fetching owner's theaters:", error);
    }
  };

  const fetchAllTheaterList = async () => {
    try {
      const { data } = await axios.get("/api/allTheaters");
      if (data.success) {
        setalltheaterList(data.list);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("❌ Frontend error while fetching all theaters:", error);
    }
  };

  const fetchBlocks = async (theaterId: string) => {
    try {
      const { data } = await axios.get(
        `/api/owner/fetchBlockList?theaterId=${theaterId}`
      );
      if (data.success) {
        setBlocks(data.blocks);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch blocks");
      console.error(error);
    }
  };

  const fetchFoodCourts = async (theaterId: string, blockName?: string) => {
    try {
      let url = `/api/owner/fetchFoodCourtList?theaterId=${theaterId}`;
      if (blockName) url += `&block=${blockName}`;
      const { data } = await axios.get(url);
      if (data.success) {
        setFoodCourts(data.foodCourtList);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch food courts");
      console.error(error);
    }
  };

  const fetchMovies = async (theaterId: string) => {
    try {
      setSelectedTheaterId(theaterId);
      const res = await axios.get(
        `/api/owner/fetchMovieList?theaterId=${theaterId}`
      );
      setMovies(res.data.movies || []);
    } catch (error) {
      console.error("❌ Error fetching movies:", error);
    }
  };

  const fetchBookingsList = async (theaterId: string) => {
    setSelectedTheaterId(theaterId);
    try {
      const { data } = await axios.get(
        `/api/owner/fetchBookingList?theaterId=${theaterId}`
      );

      if (data.success) {
        setBookings(data.bookingList);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching booking by theater id ", error);
      toast.error("Failed to fetch bookings by theater id");
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);

    const { data } = await axios.post("/api/upload", form);
    if (data.success) {
      toast.success("✅ Image uploaded successfully!");
      return data.secure_url;
    } else {
      toast.error("❌ Upload failed");
    }
    throw new Error("Upload failed");
  };

  useEffect(() => {
    fetchAllTheaterList();
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn && role === "owner") {
      fetchTheatersList();
    }
  }, [isLoaded, isSignedIn, role]);

  return (
    <StateContext.Provider
      value={{
        user,
        role,
        isSignedIn: isSignedIn ?? false,
        isLoaded,
        theaterList,
        settheaterList,
        alltheaterList,
        setalltheaterList,
        blocks,
        setBlocks,
        fetchBlocks,
        foodCourts,
        setFoodCourts,
        fetchFoodCourts,
        movies,
        setMovies,
        fetchMovies,
        selectedTheaterId,
        setSelectedTheaterId,
        fetchBookingsList,
        bookings,
        setBookings,
        uploadFile,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
