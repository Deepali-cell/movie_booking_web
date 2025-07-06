import ConnectDb from "@/lib/ConnectDb";
import groupPlane from "@/models/groupPlaneModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { inviteLink, movieId } = body;

    const group = await groupPlane.findOne({ inviteLink });

    if (!group) {
      return NextResponse.json({ success: false, message: "Group not found" });
    }

    // ✅ Check if voting period ended
    if (new Date() > new Date(group.votingEndsAt)) {
      group.votingStarted = false;

      // calculate winner if not already done
      if (!group.finalMovie) {
        const voteCount: Record<string, number> = {};
        group.votes.forEach((v: any) => {
          voteCount[v.movie] = (voteCount[v.movie] || 0) + 1;
        });

        const winnerMovieId = Object.keys(voteCount).reduce((a, b) =>
          voteCount[a] > voteCount[b] ? a : b
        );

        group.finalMovie = winnerMovieId;
      }

      await group.save();
      return NextResponse.json({
        success: false,
        message: "Voting period is over. Winner finalized.",
      });
    }

    // ✅ Check already voted
    if (group.votes.some((vote: any) => vote.user === userId)) {
      return NextResponse.json({
        success: false,
        message: "You have already voted.",
      });
    }

    group.votes.push({
      user: userId,
      movie: movieId,
    });

    await group.save();

    return NextResponse.json({ success: true, message: "Vote recorded." });
  } catch (err) {
    console.error("Vote API Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
