import { NextResponse } from "next/server"; // Ensure this is imported
import { getServerSession } from "next-auth"; // Ensure this is imported
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth"; // Adjust the path as per your project structure

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profiles = await prisma.profile.findMany({
      where: {
        user: {
          email: {
            not: session.user.email, // Exclude the current user
          },
        },
        images: {
          some: {}, // Ensure profiles have at least one image
        },
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

    // Add default values for missing fields
    const sanitizedProfiles = profiles.map((profile) => ({
      id: profile.id,
      name: profile.name || "Anonymous",
      age: profile.age || "N/A",
      bio: profile.bio || "No bio available.",
      firstImage: profile.images[0]?.url || "/default-avatar.png",
      images: profile.images,
    }));

    console.log("Sanitized Profiles:", sanitizedProfiles);

    return NextResponse.json({ profiles: sanitizedProfiles });
  } catch (error) {
    console.error("Error in GET /api/swipe:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
