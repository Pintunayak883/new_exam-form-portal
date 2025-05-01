import { connectToDatabase } from "@/lib/mongodb";
import Form from "@/models/form";
import { NextRequest, NextResponse } from "next/server";

// Month mapping for full month names
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { examName, heldDate, startDate, endDate, examCount } =
      await req.json();

    // Validation
    if (!examName || !heldDate || !startDate || !endDate || examCount == null) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate heldDate format (Month YYYY)
    const [month, year] = heldDate.split(" ");
    if (!monthNames.includes(month) || !/^\d{4}$/.test(year)) {
      return NextResponse.json(
        { error: "Invalid held date format (Month YYYY)" },
        { status: 400 }
      );
    }

    // Validate examCount
    if (isNaN(examCount) || examCount <= 0) {
      return NextResponse.json(
        { error: "Invalid exam count" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }
    if (start >= end) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    const newForm = new Form({
      examName,
      heldDate,
      startDate,
      endDate,
      examCount,
    });

    await newForm.save();

    return NextResponse.json(newForm, { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "Failed to create form" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Fetch the latest form (sorted by createdAt descending)
    const form = await Form.findOne().sort({ createdAt: -1 });

    if (!form) {
      return NextResponse.json({ error: "No forms found" }, { status: 404 });
    }

    return NextResponse.json(form, { status: 200 });
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
  }
}
