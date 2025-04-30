import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // params ko Promise ke roop mein type kiya
) {
  try {
    // Await params to resolve the dynamic route parameter
    const resolvedParams = await params;
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Database connected successfully");

    console.log("Resolved Params:", resolvedParams);
    if (!resolvedParams?.id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(resolvedParams.id)) {
      return NextResponse.json(
        { message: "Invalid User ID format" },
        { status: 400 }
      );
    }

    const { status } = await request.json();
    if (!status || !["pending", "reject", "approve"].includes(status)) {
      return NextResponse.json(
        { message: "Valid status is required" },
        { status: 400 }
      );
    }

    console.log("Updating user with ID:", resolvedParams.id, "Status:", status);
    const user = await User.findByIdAndUpdate(
      resolvedParams.id,
      { status },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error in PUT /api/admin/candidate/[id]:", error);
    return NextResponse.json(
      { message: "Server error, please try again!" },
      { status: 500 }
    );
  }
}
