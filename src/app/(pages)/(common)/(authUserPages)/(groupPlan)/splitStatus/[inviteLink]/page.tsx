"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { GroupPlanType } from "@/lib/types";

interface GroupPlanWithCurrentUser extends GroupPlanType {
  currentUser?: string;
}

export default function SplitStatusPage() {
  const { inviteLink } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [splitData, setSplitData] = useState<GroupPlanWithCurrentUser | null>(
    null
  );

  useEffect(() => {
    const fetchSplitStatus = async () => {
      try {
        const { data } = await axios.get(
          `/api/splitStatus?inviteLink=${inviteLink}`
        );
        if (data.success) {
          setSplitData(data.group);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load split details");
      } finally {
        setLoading(false);
      }
    };
    fetchSplitStatus();
  }, [inviteLink]);

  const handlePayNow = async () => {
    try {
      const { data } = await axios.post(`/api/splitPay`, { inviteLink });
      if (data.success) {
        toast.success("Payment successful!");
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  if (loading) {
    return (
      <div className="text-white h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-20 p-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">💰 Split Payment Status</h1>

      {splitData?.splitDetails?.map((u, idx) => (
        <div
          key={idx}
          className={`flex justify-between items-center p-4 mb-2 rounded
          ${u.paid ? "bg-green-700/50" : "bg-red-700/50"}`}
        >
          <span>User: {typeof u.user === "string" ? u.user : u.user.name}</span>
          <span>Amount: ₹{u.amount}</span>
          <span>Status: {u.paid ? "✅ Paid" : "❌ Pending"}</span>
        </div>
      ))}

      {splitData?.splitDetails?.find(
        (u) => !u.paid && u.user === splitData.currentUser
      ) && (
        <div className="mt-6">
          <button
            onClick={handlePayNow}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg"
          >
            Pay Your Share Now
          </button>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/myBookings")}
          className="text-blue-400 underline"
        >
          Go to My Bookings
        </button>
      </div>
    </div>
  );
}
