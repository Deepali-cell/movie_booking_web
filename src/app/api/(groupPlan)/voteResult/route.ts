import ConnectDb from "@/lib/ConnectDb";
import groupPlane from "@/models/groupPlaneModel";
import Show from "@/models/showModel";
import Theater from "@/models/threaterModel";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import "@/models/movieModel";

export async function GET(req: NextRequest) {
  try {
    await ConnectDb();
    const { userId } = await auth();

    const { searchParams } = new URL(req.url);
    const inviteLink = searchParams.get("inviteLink");

    const group = await groupPlane.findOne({ inviteLink });

    if (!group) {
      return NextResponse.json({ success: false, message: "Group not found" });
    }

    // is this user the creator?
    const isCreator = group.creator === userId;

    if (
      !group.finalMovie &&
      (!group.votingStarted || new Date() < new Date(group.votingEndsAt))
    ) {
      return NextResponse.json({
        success: false,
        message: "Voting is still ongoing.",
      });
    }

    let finalMovie = null;
    let theater = null;

    if (group.finalMovie) {
      finalMovie = await Show.findById(group.finalMovie).populate("movie");
      theater = await Theater.findOne({ moviesPlaying: group.finalMovie });
    } else {
      const voteCount: Record<string, number> = {};
      group.votes.forEach((vote: any) => {
        const movieId = vote.movie.toString();
        voteCount[movieId] = (voteCount[movieId] || 0) + 1;
      });

      const winnerShowId = Object.entries(voteCount).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0];

      if (winnerShowId) {
        group.finalMovie = winnerShowId;
        await group.save();

        finalMovie = await Show.findById(winnerShowId).populate("movie");
        theater = await Theater.findOne({ moviesPlaying: winnerShowId });
      }
    }

    return NextResponse.json({
      success: true,
      finalMovie,
      theater,
      isCreator,
      paymentStatus: group.paymentStatus,
      message: group.finalMovie
        ? `Show ${group.finalMovie} won the voting!`
        : "No votes cast.",
    });
  } catch (err) {
    console.error("Voting Result API Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
