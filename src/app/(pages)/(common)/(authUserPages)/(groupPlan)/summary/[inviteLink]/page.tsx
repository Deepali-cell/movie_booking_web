"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { GroupPlanType } from "@/lib/types";

interface GroupSummaryResponse {
  success: boolean;
  group: GroupPlanType;
  isCreator: boolean;
  currentUser: string;
  allSelected: boolean;
}

export default function SummaryPage() {
  const { inviteLink } = useParams();
  const router = useRouter();

  const [groupData, setGroupData] = useState<GroupSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get(
          `/api/groupData?inviteLink=${inviteLink}`
        );
        if (data.success) {
          setGroupData(data);

          if (data.group.votingStarted) {
            updateRemainingTime(data.group.votingEndsAt);
          }

          const myVote = data.group.votes.find(
            (v: any) => v.user === data.currentUser
          );
          if (myVote) {
            setSelectedShow(
              typeof myVote.movie === "string" ? myVote.movie : myVote.movie._id
            );
            setHasVoted(true);
          }
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load group summary");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [inviteLink]);

  // ⏰ countdown
  useEffect(() => {
    if (!groupData?.group?.votingEndsAt) return;
    const interval = setInterval(
      () => updateRemainingTime(groupData.group.votingEndsAt!),
      1000
    );
    return () => clearInterval(interval);
  }, [groupData]);

  // redirect on voting end
  useEffect(() => {
    if (remainingTime === 0 && groupData?.group?.votingStarted) {
      toast("Voting ended! Redirecting...");
      setTimeout(() => router.push(`/voteResult/${inviteLink}`), 1500);
    }
  }, [remainingTime, groupData, router, inviteLink]);

  // auto redirect if already final
  useEffect(() => {
    if (!loading && groupData?.group?.finalMovie) {
      toast("Voting completed! Redirecting to results...");
      router.push(`/voteResult/${inviteLink}`);
    }
  }, [loading, groupData, router, inviteLink]);

  const updateRemainingTime = (endTime: string) => {
    const diff = new Date(endTime).getTime() - Date.now();
    setRemainingTime(Math.max(0, Math.floor(diff / 1000)));
  };

  async function startVoting(inviteLink: string) {
    try {
      await axios.post(`/api/votingStart`, { inviteLink });
      toast.success("Voting started!");
      setGroupData((prev) =>
        prev
          ? {
              ...prev,
              group: {
                ...prev.group,
                votingStarted: true,
                votingEndsAt: new Date(
                  Date.now() + 3 * 60 * 1000
                ).toISOString(),
              },
            }
          : null
      );
      updateRemainingTime(new Date(Date.now() + 3 * 60 * 1000).toISOString());
    } catch (err) {
      console.error(err);
      toast.error("Failed to start voting");
    }
  }

  const handleVote = async (showId: string) => {
    if (remainingTime <= 0) return toast.error("Voting time is over!");
    try {
      await axios.post("/api/vote", { inviteLink, movieId: showId });
      toast.success("Vote submitted!");
      setSelectedShow(showId);
      setHasVoted(true);
    } catch (err) {
      console.error(err);
      toast.error("Could not submit vote");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading summary...
      </div>
    );
  }

  if (!groupData) return <div>Failed to load</div>;

  const { group, allSelected, isCreator, currentUser } = groupData;

  return (
    <div className="flex flex-col min-h-screen pt-20 px-4 text-white max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-6 md:space-y-0">
        <div>
          <p className="text-xl mb-2">
            👑 Creator:{" "}
            <span className="font-bold text-green-400">
              {typeof group.creator !== "string"
                ? `${group.creator.email} (${group.creator.phoneNumber})`
                : group.creator}
            </span>
          </p>
          <p className="text-md">
            🧑‍🤝‍🧑 Invited Users:{" "}
            {group.invitedUsers.length > 0 ? (
              group.invitedUsers.map((user, i) => (
                <span key={i} className="mr-3 text-gray-200">
                  {typeof user !== "string"
                    ? `${user.email} (${user.phoneNumber})`
                    : user}
                </span>
              ))
            ) : (
              <span className="text-gray-400">None</span>
            )}
          </p>
        </div>

        <div>
          {isCreator &&
            !group.votingStarted &&
            (allSelected ? (
              <button
                onClick={() => startVoting(group.inviteLink)}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-full text-lg transition"
              >
                🚀 Start Voting
              </button>
            ) : (
              <p className="text-yellow-400">
                Waiting for all members to complete their selection...
              </p>
            ))}
          {!isCreator && !group.votingStarted && (
            <p className="text-blue-400">
              Waiting for creator to start voting...
            </p>
          )}
          {group.votingStarted && (
            <p className="text-green-400 font-mono">
              ⏰ Voting ends in {remainingTime}s
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-8">
        {group.userSelections.map((sel, idx) => (
          <div
            key={idx}
            className="bg-white/10 border border-white/20 rounded-xl p-6 hover:shadow-2xl transition"
          >
            <h3 className="text-2xl font-bold mb-3">
              👤{" "}
              {typeof sel.user !== "string" && sel.user._id === currentUser
                ? "You"
                : typeof sel.user !== "string"
                ? `${sel.user.email} (${sel.user.phoneNumber})`
                : sel.user}
            </h3>
            <div className="space-y-6">
              {sel.theaters.map((th, i) => (
                <div
                  key={i}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <h4 className="text-xl font-semibold">
                    {typeof th !== "string" ? th.name : th}
                  </h4>
                </div>
              ))}
              {sel.shows.map((sh, i) => (
                <div
                  key={i}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 flex flex-col md:flex-row gap-4 items-center"
                >
                  <h4 className="text-lg font-semibold">
                    🎥 {typeof sh !== "string" ? sh.movie.title : sh}
                  </h4>
                  {group.votingStarted && (
                    <button
                      disabled={remainingTime <= 0 || hasVoted}
                      onClick={() =>
                        handleVote(typeof sh === "string" ? sh : sh._id)
                      }
                      className={`px-4 py-2 rounded-lg mt-4 md:mt-0 ${
                        selectedShow === (typeof sh === "string" ? sh : sh._id)
                          ? "bg-green-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {selectedShow === (typeof sh === "string" ? sh : sh._id)
                        ? "✅ Voted"
                        : "Vote"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
