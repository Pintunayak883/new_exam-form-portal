import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import User, { IUser } from "@/models/User";

// Response type interface
interface ResponseData {
  message: string;
  error?: string;
}

// User data interface
interface UserData {
  name: string;
  password: string;
  email: string;
  dob?: string;
  area?: string;
  landmark?: string;
  examCityPreference1?: string;
  examCityPreference2?: string;
  previousCdaExperience?: string;
  cdaExperienceYears?: string;
  cdaExperienceRole?: string;
  photo?: string;
  signature?: string;
  thumbprint?: string;
  aadhaarNo?: string;
  penaltyClauseAgreement?: boolean;
  fever?: string;
  cough?: string;
  breathlessness?: string;
  soreThroat?: string;
  otherSymptoms?: string;
  otherSymptomsDetails?: string;
  closeContact?: string;
  covidDeclarationAgreement?: boolean;
  accountHolderName?: string;
  bankName?: string;
  ifsc?: string;
  branch?: string;
  bankAccountNo?: string;
  currentDate?: string;
  sonOf?: string;
  resident?: string;
  status?: string;
}

// Utility function to validate required fields
const validateUserData = (data: UserData): string | null => {
  if (!data.name || !data.email || !data.password) {
    return "Name, email, and password are required";
  }
  return null;
};

// Utility function to extract email from JWT token
const getEmailFromToken = (token: string): string | null => {
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { email: string };
    return decodedToken.email;
  } catch {
    return null;
  }
};

// Type-safe POST request handler for creating a new user
export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse the request body
    const body: UserData = await req.json();

    // Validate required fields
    const validationError = validateUserData(body);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Check if user already exists
    const existingUser: IUser | null = await User.findOne({
      email: body.email,
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword: string = await bcrypt.hash(body.password, 6);

    // Create new user with all fields from body
    const newUser = new User({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      dob: body.dob || "",
      area: body.area || "",
      landmark: body.landmark || "",
      examCityPreference1: body.examCityPreference1 || "",
      examCityPreference2: body.examCityPreference2 || "",
      previousCdaExperience: body.previousCdaExperience || "No",
      cdaExperienceYears: body.cdaExperienceYears || "",
      cdaExperienceRole: body.cdaExperienceRole || "",
      photo: body.photo || "",
      signature: body.signature || "",
      thumbprint: body.thumbprint || "",
      aadhaarNo: body.aadhaarNo || "",
      penaltyClauseAgreement: body.penaltyClauseAgreement || false,
      fever: body.fever || "No",
      cough: body.cough || "No",
      breathlessness: body.breathlessness || "No",
      soreThroat: body.soreThroat || "No",
      otherSymptoms: body.otherSymptoms || "No",
      otherSymptomsDetails: body.otherSymptomsDetails || "",
      closeContact: body.closeContact || "No",
      covidDeclarationAgreement: body.covidDeclarationAgreement || false,
      accountHolderName: body.accountHolderName || "",
      bankName: body.bankName || "",
      ifsc: body.ifsc || "",
      branch: body.branch || "",
      bankAccountNo: body.bankAccountNo || "",
      currentDate: body.currentDate || "",
      sonOf: body.sonOf || "",
      resident: body.resident || "",
    });

    // Save the new user
    await newUser.save();

    // Return success response
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle any errors and return a server error response
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// Type-safe PUT request handler for updating user details
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    // Parse the request body
    const body: UserData = await req.json();

    // Connect to the database
    await connectToDatabase();

    // Get the logged-in user's email from JWT token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Authorization token missing" },
        { status: 401 }
      );
    }

    const email = getEmailFromToken(token);
    if (!email) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Check if the user exists
    const existingUser: IUser | null = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create an object to store fields to update
    const updateFields: Partial<UserData> = {};

    // Dynamically add fields to updateFields if they exist in the request body
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        updateFields[key as keyof UserData] = value;
      }
    }

    // Optionally validate new fields (e.g., currentDate format)
    if (updateFields.currentDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(updateFields.currentDate)) {
        return NextResponse.json(
          { message: "Invalid currentDate format (use YYYY-MM-DD)" },
          { status: 400 }
        );
      }
    }

    // Update user data in the database
    await User.updateOne({ email }, { $set: updateFields });

    // Return success response
    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle any errors and return a server error response
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// Type-safe GET request handler for fetching user data
export async function GET(req: Request): Promise<NextResponse> {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the logged-in user's email from JWT token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Token nahi mila, login kar ke aaja!" },
        { status: 401 }
      );
    }

    const email = getEmailFromToken(token);
    if (!email) {
      return NextResponse.json(
        { message: "Token galat hai, dobara try kar!" },
        { status: 401 }
      );
    }

    // Fetch user data with selected fields using lean to avoid Document type
    const user = (await User.findOne({ email })
      .select("-password -__v")
      .lean()) as IUser | null; // Yeh le, TypeScript ab chup ho gaya

    if (!user) {
      return NextResponse.json(
        { message: "User nahi mila, kahaan chhup gaya?" },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    // Handle errors humbly
    return NextResponse.json(
      { message: "Server ka mood kharab hai!", error: error.message },
      { status: 500 }
    );
  }
}
