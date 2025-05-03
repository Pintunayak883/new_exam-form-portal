import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// GET method for admin to fetch all users
export async function GET() {
  try {
    await connectToDatabase(); // Database connection

    // Sirf complete forms wale users fetch karo
    const users = await User.find({
      name: { $nin: [null, ""] },
      email: { $nin: [null, ""] },
      aadhaarNo: { $nin: [null, ""] },
      phone: { $nin: [null, ""] },
      address: { $nin: [null, ""] },
      examCityPreference1: { $nin: [null, ""] },
      photo: { $nin: [null, ""] },
      signature: { $nin: [null, ""] },
      penaltyClauseAgreement: true,
      covidDeclarationAgreement: true,
    })
      .sort({ createdAt: -1 })
      .lean();
    //console.log(users);
    return NextResponse.json(
      {
        success: true,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Admin user fetch failed",
      },
      { status: 500 }
    );
  }
}
