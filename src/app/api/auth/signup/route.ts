import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import User, { IUser } from "@/models/User";

// Interface for response structure
interface ResponseData {
  message: string;
  error?: string;
}

// Interface for user data
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

// Helper function to check required fields
const validateUserData = (data: UserData): string | null => {
  if (!data.name || !data.email || !data.password) {
    return "Name, email, and password are required.";
  }
  return null;
};

// Helper to decode email from JWT token
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

// POST handler to create a new user
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: UserData = await req.json();

    const validationError = validateUserData(body);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser: IUser | null = await User.findOne({
      email: body.email,
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword: string = await bcrypt.hash(body.password, 6);

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

    await newUser.save();

    return NextResponse.json(
      { message: "User account created successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Something went wrong on the server.", error: error.message },
      { status: 500 }
    );
  }
}

// PUT handler to update existing user data
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const body: UserData = await req.json();

    await connectToDatabase();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is missing." },
        { status: 401 }
      );
    }

    const email = getEmailFromToken(token);
    if (!email) {
      return NextResponse.json(
        { message: "Invalid or expired authorization token." },
        { status: 401 }
      );
    }

    const existingUser: IUser | null = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const updateFields: Partial<UserData> = {};

    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        updateFields[key as keyof UserData] = value;
      }
    }

    if (updateFields.currentDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(updateFields.currentDate)) {
        return NextResponse.json(
          { message: "Invalid date format. Use YYYY-MM-DD." },
          { status: 400 }
        );
      }
    }

    await User.updateOne({ email }, { $set: updateFields });

    return NextResponse.json(
      { message: "User information updated successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}

// GET handler to fetch logged-in user's data
export async function GET(req: Request): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required." },
        { status: 401 }
      );
    }

    const email = getEmailFromToken(token);
    if (!email) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const user = (await User.findOne({ email })
      .select("-password -__v")
      .lean()) as IUser | null;

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch user data.", error: error.message },
      { status: 500 }
    );
  }
}
