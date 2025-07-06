"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { GroupPlanType } from "@/lib/types";
import { LinkIcon, CalendarIcon } from "@heroicons/react/24/solid";

interface GroupCardProps {
  group: GroupPlanType;
  isInvited?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, isInvited = false }) => {
  const router = useRouter();
  const canSeeResult = group.finalMovie && group.groupBooking;

  return (
    <div
      className={`p-5 rounded-xl transition ${
        isInvited
          ? "bg-[#102a1f] border border-green-600 hover:border-green-400"
          : "bg-[#1f2937] border border-gray-700 hover:border-blue-500 hover:shadow-lg"
      }`}
    >
      <p
        className={`text-sm flex items-center gap-2 ${
          isInvited ? "text-green-300" : "text-gray-300"
        }`}
      >
        <LinkIcon
          className={`w-4 h-4 ${
            isInvited ? "text-green-400" : "text-blue-400"
          }`}
        />
        <strong>Link:</strong> {group.inviteLink}
      </p>
      <p
        className={`text-xs mt-1 flex items-center gap-2 ${
          isInvited ? "text-green-400" : "text-gray-400"
        }`}
      >
        <CalendarIcon className="w-4 h-4" />
        <strong>{isInvited ? "Invited" : "Created"}:</strong>{" "}
        {new Date(group.createdAt).toLocaleString()}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => router.push(`/group/${group.inviteLink}`)}
          className={`px-4 py-2 rounded text-sm ${
            isInvited
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Open Group
        </button>
        {canSeeResult && (
          <button
            onClick={() => router.push(`/voteResult/${group.inviteLink}`)}
            className={`px-4 py-2 rounded text-sm ${
              isInvited
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            See Result
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupCard;
