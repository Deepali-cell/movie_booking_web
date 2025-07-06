"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

export default function JoinGroupPage() {
  const { inviteLink } = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      openSignIn({ afterSignInUrl: `/joinGroup/${inviteLink}` });
    } else {
      const joinGroup = async () => {
        try {
          const { data } = await axios.post(
            `/api/joinGroup?inviteLink=${inviteLink}`,
            { userId: user.id }
          );

          if (data.success) {
            if (data.alreadyJoined) {
              // ✅ Already member or creator, go directly to group page
              router.replace(`/group/${inviteLink}`);
            } else {
              toast.success("You joined the group!");
              router.push(`/group/${inviteLink}`);
            }
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.log("Error :", error);
          toast.error("Failed to join group");
        }
      };

      joinGroup();
    }
  }, [isLoaded, user, inviteLink, router, openSignIn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <svg
        className="animate-spin h-10 w-10 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <p className="text-xl font-medium text-gray-700">Joining group...</p>
    </div>
  );
}
