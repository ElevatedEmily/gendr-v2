import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const ageMin = parseInt(searchParams.get("ageMin") || "0", 10);
    const ageMax = parseInt(searchParams.get("ageMax") || "100", 10);

    // Fetch profiles with at least one image and within the age range
    const profiles = await prisma.profile.findMany({
      where: {
        user: {
          email: {
            not: session.user.email, // Exclude the current user
          },
        },
        images: {
          some: {}, // Ensure the profile has at least one image
        },
        age: {
          gte: ageMin,
          lte: ageMax,
        },
      },
      include: {
        images: true,
      },
    });
    console.log("Raw profiles from DB:", profiles);
    // Sanitize and add default values
    const sanitizedProfiles = profiles.map((profile) => ({
      id: profile.id,
      name: profile.name || "Anonymous",
      age: profile.age || "N/A",
      bio: profile.bio || "No bio available.",
      avatarUrl: profile.avatarUrl || "/default-avatar.png",
      firstImage: profile.images[0]?.url || "/default-avatar.png", // Use the first image
    }));
    console.log("Sanitized profiles returned:", sanitizedProfiles);
    return NextResponse.json({ profiles: sanitizedProfiles });
  } catch (error) {
    console.error("Error in GET /api/swipe-options:", error.message);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
