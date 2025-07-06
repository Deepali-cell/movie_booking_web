"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { UserGroupIcon, PlusIcon, InboxIcon } from "@heroicons/react/24/solid";
import { GroupPlanType } from "@/lib/types";
import GroupCard from "@/components/groupComponents/GroupCard";

export default function CreateGroupPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [createdGroups, setCreatedGroups] = useState<GroupPlanType[]>();
  const [invitedGroups, setInvitedGroups] = useState<GroupPlanType[]>();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchGroups = async () => {
      try {
        const { data } = await axios.get(`/api/myGroups?userId=${user.id}`);
        if (data.success) {
          setCreatedGroups(data.createdGroups);
          setInvitedGroups(data.invitedGroups);
        } else {
          toast.error("Failed to load groups.");
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast.error("Could not load groups.");
      }
    };

    fetchGroups();
  }, [isLoaded, user]);

  const handleCreateGroup = async () => {
    try {
      const { data } = await axios.post("/api/groupCreate", {
        creator: user?.id,
      });
      if (data.success) {
        toast.success("Group created!");
        router.push(`/group/${data.inviteLink}`);
      } else {
        toast.error(data.message || "Could not create group.");
      }
    } catch (err) {
      console.error("Error creating group:", err);
      toast.error("Failed to create group.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white">
      <main className="flex-grow p-6 pt-24 max-w-5xl mx-auto">
        {!isLoaded ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <UserGroupIcon className="w-8 h-8 text-blue-500" />
                Your Movie Groups
              </h2>
              <button
                onClick={handleCreateGroup}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl shadow text-white"
              >
                <PlusIcon className="w-5 h-5" />
                Create Group
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Created Groups */}
              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <InboxIcon className="w-6 h-6 text-indigo-400" />
                  Created by You
                </h3>
                {createdGroups?.length === 0 ? (
                  <p className="text-gray-400 italic">No groups created yet.</p>
                ) : (
                  <div className="space-y-4">
                    {createdGroups?.map((group) => (
                      <GroupCard key={group._id} group={group} />
                    ))}
                  </div>
                )}
              </div>

              {/* Invited Groups */}
              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <UserGroupIcon className="w-6 h-6 text-green-400" />
                  Invited Groups
                </h3>
                {invitedGroups?.length === 0 ? (
                  <p className="text-gray-400 italic">No invitations yet.</p>
                ) : (
                  <div className="space-y-4">
                    {invitedGroups?.map((group) => (
                      <GroupCard key={group._id} group={group} isInvited />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
