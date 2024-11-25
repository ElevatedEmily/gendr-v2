import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id; // Ensure `session.user.id` is available
    const likedDislikedProfiles = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
      select: {
        user1Id: true,
        user2Id: true,
      },
    });

    const excludedUserIds = likedDislikedProfiles
      .flatMap((match) => [match.user1Id, match.user2Id])
      .filter((id) => id !== userId);

    const profiles = await prisma.profile.findMany({
      where: {
        userId: { notIn: [userId, ...excludedUserIds] }, // Exclude already seen profiles
        images: { some: {} }, // Ensure profiles have at least one image
      },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    const sanitizedProfiles = profiles.map((profile) => ({
      id: profile.id,
      name: profile.name || "Anonymous",
      age: profile.age || "N/A",
      bio: profile.bio || "No bio available.",
      firstImage: profile.images[0]?.url || "/default-avatar.png",
      images: profile.images,
    }));

    return NextResponse.json({ profiles: sanitizedProfiles });
  } catch (error) {
    console.error("Error in GET /api/swipe:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { profileId, action } = await req.json();
    const userId = session.user.id; // Ensure `session.user.id` is available

    if (!profileId || !["like", "dislike"].includes(action)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Check if the profileId corresponds to a valid user
    const targetProfile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!targetProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const targetUserId = targetProfile.userId;

    if (action === "like") {
      // Check if the other user has already liked this user
      const existingLike = await prisma.match.findFirst({
        where: {
          user1Id: targetUserId,
          user2Id: userId,
        },
      });

      if (existingLike) {
        // Create a mutual match
        const newMatch = await prisma.match.create({
          data: {
            user1Id: userId,
            user2Id: targetUserId,
          },
        });

        // Optionally create an initial message for the match
        await prisma.message.create({
          data: {
            matchId: newMatch.id,
            senderId: userId,
            content: "You have a new match! Start chatting!",
          },
        });

        return NextResponse.json({ message: "It's a match!" });
      }

      // Record this like, but no match yet
      await prisma.match.create({
        data: {
          user1Id: userId,
          user2Id: targetUserId,
        },
      });

      return NextResponse.json({ message: "Liked the profile!" });
    }

    if (action === "dislike") {
      // Log dislike in the matches table without creating a real match
      await prisma.match.create({
        data: {
          user1Id: userId,
          user2Id: targetUserId,
        },
      });

      return NextResponse.json({ message: "Disliked the profile." });
    }

    return NextResponse.json({ error: "Unhandled action" }, { status: 400 });
  } catch (error) {
    console.error("Error in POST /api/swipe:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
