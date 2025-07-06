"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { ShowType, TheaterType } from "@/lib/types";

interface VoteResultResponse {
  success: boolean;
  finalMovie?: ShowType;
  theater?: TheaterType;
  message: string;
  isCreator: boolean;
  paymentStatus: "pending" | "split" | "singlePaid" | "completed";
}

export default function ResultPage() {
  const { inviteLink } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [finalMovie, setFinalMovie] = useState<ShowType | null>(null);
  const [theater, setTheater] = useState<TheaterType | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "split" | "singlePaid" | "completed"
  >("pending");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data } = await axios.get<VoteResultResponse>(
          `/api/voteResult?inviteLink=${inviteLink}`
        );
        if (data.success) {
          setFinalMovie(data.finalMovie ?? null);
          setTheater(data.theater ?? null);
          setIsCreator(data.isCreator);
          setMessage(data.message);
          setPaymentStatus(data.paymentStatus);
        } else {
          setMessage(data.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not load result.");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [inviteLink]);

  const handleSetPaymentMode = async (mode: "split" | "singlePaid") => {
    try {
      await axios.post("/api/setPaymentMethod", {
        inviteLink,
        mode,
      });
      toast.success(`Payment mode set to ${mode}`);
      if (finalMovie) {
        router.push(`/seatLayout/${finalMovie._id}?inviteLink=${inviteLink}`);
      }
    } catch (err) {
      console.error("Error setting payment mode", err);
      toast.error("Failed to set payment mode");
    }
  };
  useEffect(() => {
    if (
      !loading &&
      ["split", "singlePaid", "completed"].includes(paymentStatus)
    ) {
      router.replace(`/splitStatus/${inviteLink}`);
    }
  }, [loading, paymentStatus, router, inviteLink]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading result...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6 pt-20 mx-auto max-w-3xl text-white">
      <h2 className="text-3xl font-bold mb-8">🎉 Voting Result</h2>

      {finalMovie && theater ? (
        <div className="bg-green-800/20 border border-green-500/30 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Image
              src={finalMovie.movie.poster_path}
              alt={finalMovie.movie.title}
              width={200}
              height={300}
              className="rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">
                {finalMovie.movie.title}
              </h3>
              <p className="text-gray-300 mb-1">
                {finalMovie.movie.genres.map((g) => g.name).join(", ")} |{" "}
                {finalMovie.movie.release_date}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                ⏱ Runtime: {finalMovie.movie.runtime} mins
              </p>

              <div className="text-sm space-y-1">
                <p>
                  🗓 Show Date:{" "}
                  <span className="font-semibold">{finalMovie.showDate}</span>
                </p>
                <p>
                  ⏰ Show Time:{" "}
                  <span className="font-semibold">{finalMovie.showTime}</span>
                </p>
                <p>💰 Price: ₹{finalMovie.showPrice}</p>
                <p>
                  Status:{" "}
                  <span
                    className={
                      finalMovie.status === "scheduled"
                        ? "text-green-400"
                        : finalMovie.status === "cancelled"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }
                  >
                    {finalMovie.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-xl font-semibold mb-2">📍 Theater Details:</h4>
            <div className="space-y-1 text-sm">
              <p className="font-bold text-lg">{theater.name}</p>
              <p>
                {theater.location?.addressLine}, {theater.location?.city},{" "}
                {theater.location?.state}
              </p>
              <p>
                📞 {theater.contact?.phone} | ✉️ {theater.contact?.email}
              </p>
              <p>🏷 Tier: {theater.tier}</p>
            </div>
          </div>

          {isCreator &&
            !["split", "singlePaid", "completed"].includes(paymentStatus) && (
              <div className="mt-8 space-y-4">
                <h4 className="text-xl font-bold">
                  💰 How do you want to pay?
                </h4>
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => handleSetPaymentMode("singlePaid")}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition"
                  >
                    💳 Single Person Pays
                  </button>
                  <button
                    onClick={() => handleSetPaymentMode("split")}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-full text-lg font-semibold transition"
                  >
                    🤝 Split Among All
                  </button>
                </div>
              </div>
            )}
        </div>
      ) : (
        <div className="bg-yellow-700/30 p-6 rounded-xl border border-yellow-400/30 shadow-lg">
          <p className="text-xl">{message}</p>
        </div>
      )}
    </div>
  );
}
