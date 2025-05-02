// src/app/api/form/route.ts

import { connectToDatabase } from "@/lib/mongodb";
import Form from "@/models/form";
import { NextResponse } from "next/server";

// humbly: POST request – naya data aaye toh purana hatao aur replace karo
export async function POST(req: Request) {
  await connectToDatabase();

  const body = await req.json();

  try {
    const replacedData = await Form.findOneAndReplace(
      { key: "singleton" }, // hamesha sirf ek entry
      { ...body, key: "singleton" }, // key fix rakhna zaruri hai
      { upsert: true, new: true } // mila toh replace, nahi toh insert
    );

    return NextResponse.json({ success: true, data: replacedData });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Replace mein kuch to gadbad hai!" },
      { status: 500 }
    );
  }
}

// humbly: GET request – ek hi data lana hai
export async function GET() {
  await connectToDatabase();

  try {
    const data = await Form.findOne({ key: "singleton" }); // model ka naam sahi karo

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Data lana fail ho gaya guruji!" },
      { status: 500 }
    );
  }
}
