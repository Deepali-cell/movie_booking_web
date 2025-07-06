"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaLink,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaCopy,
  FaShareAlt,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { GroupPlanType } from "@/lib/types";

export default function GroupPage() {
  const { inviteLink } = useParams();
  const [group, setGroup] = useState<GroupPlanType>();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const { data } = await axios.get(
          `/api/groupData?inviteLink=${inviteLink}`
        );

        if (!data.success) {
          toast.error(data.message || "Group data nahi mila");
          return;
        }

        if (
          data.group.finalMovie ||
          ["split", "singlePaid", "completed"].includes(
            data.group.paymentStatus
          )
        ) {
          router.push(`/splitStatus/${inviteLink}`);
        } else {
          setGroup(data.group); // 👈 ye zaroori hai taaki page render ho
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch group data");
      }
    };
    fetchGroup();
  }, [inviteLink, router]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/joinGroup/${inviteLink}`;
    navigator.clipboard.writeText(link);
    toast.success("Invite link copied to clipboard!");
  };

  if (!group)
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f172a] text-white">
        Loading group data...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen text-white">
      <main className="flex-grow p-6 pt-24 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-white/10 rounded-full shadow-lg border border-white/20">
            <FaUsers className="text-green-400 text-3xl" />
          </div>
          <h2 className="text-4xl font-bold tracking-wide">Movie Group</h2>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl mb-8">
          <div className="flex items-center justify-between gap-4">
            <span className="break-all text-lg font-mono">
              {window.location.origin}/joinGroup/{inviteLink}
            </span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-full transition hover:scale-105 duration-200"
            >
              <FaCopy /> Copy
            </button>
          </div>
        </div>

        <div className="relative mb-10">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="flex items-center gap-3 px-7 py-3 bg-blue-600 hover:bg-blue-700 rounded-full transition shadow-xl hover:scale-105 duration-200"
          >
            <FaShareAlt className="text-lg" />
            Share Group
          </button>

          {showShareOptions && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 p-4 rounded-2xl transition hover:scale-105"
              >
                <FaLink className="text-blue-400 text-2xl" />
                Copy Invite Link
              </button>
              <a
                href={`https://wa.me/?text=Join%20my%20movie%20group%20at%20${window.location.origin}/joinGroup/${inviteLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 p-4 rounded-2xl transition hover:scale-105"
              >
                <FaWhatsapp className="text-green-400 text-2xl" />
                Share on WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/joinGroup/${inviteLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 p-4 rounded-2xl transition hover:scale-105"
              >
                <FaFacebookF className="text-blue-500 text-2xl" />
                Share on Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${window.location.origin}/joinGroup/${inviteLink}&text=Join%20my%20movie%20group!`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 p-4 rounded-2xl transition hover:scale-105"
              >
                <FaTwitter className="text-cyan-400 text-2xl" />
                Share on Twitter
              </a>
            </div>
          )}
        </div>
        <div>
          <Button
            onClick={() => router.push(`/selectTheaterPage/${inviteLink}`)}
          >
            Select Theater
          </Button>
        </div>
        <h3 className="mt-12 text-2xl font-semibold mb-6 border-b border-white/30 pb-2">
          Group Members
        </h3>
        <div className="flex flex-wrap gap-3">
          {group.invitedUsers.length > 0 ? (
            group.invitedUsers.map((user, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition"
              >
                {typeof user === "string" ? user : user.name}
              </span>
            ))
          ) : (
            <p className="text-gray-300">No members joined yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
