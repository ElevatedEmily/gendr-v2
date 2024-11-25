import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!user?.profile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile: user.profile });
  } catch (error) {
    console.error("Error in GET /api/profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const age = parseInt(formData.get("age") as string, 10); // Extract age from formData

    // Validate the age
    if (isNaN(age) || age < 18) {
      return NextResponse.json({ error: "Age must be a number and at least 18." }, { status: 400 });
    }

    // Validate the name (optional: adjust validation rules as needed)
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
    }

    // Handle images to delete
    const imagesToDelete = formData.getAll("imagesToDelete").map(Number);
    if (imagesToDelete.length > 0) {
      const images = await prisma.image.findMany({
        where: { id: { in: imagesToDelete } },
      });

      await prisma.image.deleteMany({
        where: { id: { in: imagesToDelete } },
      });

      for (const image of images) {
        const filePath = path.join(process.cwd(), "public", image.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Prepare upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Handle new image uploads
    const galleryImages: { url: string }[] = [];
    const imageFields = ["image1", "image2", "image3", "image4", "image5", "image6"];

    for (const key of imageFields) {
      const file = formData.get(key) as File | null;
      if (file) {
        const fileName = `${user.id}-${Date.now()}-${key}.png`;
        const filePath = path.join(uploadDir, fileName);
        const buffer = Buffer.from(await file.arrayBuffer());

        fs.writeFileSync(filePath, buffer);
        galleryImages.push({ url: `/uploads/${fileName}` });
      }
    }

    // Update profile with name, bio, age, and images
    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        name, // Include name in the update operation
        bio,
        age,
        images: {
          create: galleryImages,
        },
      },
      create: {
        userId: user.id,
        name, // Include name in the create operation
        bio,
        age,
        images: {
          create: galleryImages,
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error in POST /api/profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

