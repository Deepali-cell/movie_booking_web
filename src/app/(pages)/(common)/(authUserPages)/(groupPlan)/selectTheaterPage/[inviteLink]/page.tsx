"use client";

import TheaterCard from "@/components/common/card/TheaterCard";
import { useStateContext } from "@/context/StateContextProvider";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SelectTheaterPage() {
  const { inviteLink } = useParams();
  const { alltheaterList } = useStateContext();
  const [selectedTheaters, setSelectedTheaters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAlreadySelected = async () => {
      try {
        const { data } = await axios.get(
          `/api/groupData?inviteLink=${inviteLink}`
        );
        if (data.alreadySelected) {
          router.replace(`/summary/${inviteLink}`);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    checkAlreadySelected();
  }, [inviteLink, router]);

  const toggleTheater = (id: string) => {
    if (selectedTheaters.includes(id)) {
      setSelectedTheaters(selectedTheaters.filter((tid) => tid !== id));
    } else {
      if (selectedTheaters.length >= 2) {
        toast.error("You can select up to 2 theaters only");
        return;
      }
      setSelectedTheaters([...selectedTheaters, id]);
    }
  };

  const handleNext = async () => {
    if (selectedTheaters.length < 1) {
      toast.error("Please select at least 1 theater.");
      return;
    }

    try {
      await axios.post("/api/selection", {
        inviteLink,
        theaters: selectedTheaters,
      });
      router.push(
        `/selectShowsPage/${inviteLink}?theaters=${selectedTheaters.join(",")}`
      );
    } catch (err) {
      console.log(err);
      toast.error("Could not save selection.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20 mx-auto min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Select Your Theaters</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {alltheaterList.map((theater) => (
          <TheaterCard
            key={theater._id}
            theater={theater}
            isSelected={selectedTheaters.includes(theater._id)}
            onSelect={toggleTheater}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-full"
        >
          Next: Select Shows
        </button>
      </div>
    </div>
  );
}
