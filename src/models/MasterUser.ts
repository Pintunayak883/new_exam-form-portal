import mongoose, { Document, Schema, model, models } from "mongoose";

// Interface to define the User schema structure
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  dob?: string;
  phone?: string;
  area?: string;
  landmark?: string;
  address?: string;
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
  currentDate: string; // New field
  sonOf: string; // New field
  resident: string; // New field
  role?: "candidate" | "admin";
  status: "null" | "pending" | "reject" | "approve";
  createdAt?: Date;
}

// Define the User schema with TypeScript
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  area: {
    type: String,
    default: "",
  },
  landmark: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  examCityPreference1: {
    type: String,
    default: "",
  },
  examCityPreference2: {
    type: String,
    default: "",
  },
  previousCdaExperience: {
    type: String,
    default: "No",
  },
  cdaExperienceYears: {
    type: String,
    default: "",
  },
  cdaExperienceRole: {
    type: String,
    default: "",
  },

  aadhaarNo: {
    type: String,
    default: "",
  },
  penaltyClauseAgreement: {
    type: Boolean,
    default: false,
  },
  fever: {
    type: String,
    default: "No",
  },
  cough: {
    type: String,
    default: "No",
  },
  breathlessness: {
    type: String,
    default: "No",
  },
  soreThroat: {
    type: String,
    default: "No",
  },
  otherSymptoms: {
    type: String,
    default: "No",
  },
  otherSymptomsDetails: {
    type: String,
    default: "",
  },
  closeContact: {
    type: String,
    default: "No",
  },
  covidDeclarationAgreement: {
    type: Boolean,
    default: false,
  },
  accountHolderName: {
    type: String,
    default: "",
  },
  bankName: {
    type: String,
    default: "",
  },
  ifsc: {
    type: String,
    default: "",
  },
  branch: {
    type: String,
    default: "",
  },
  bankAccountNo: {
    type: String,
    default: "",
  },
  currentDate: {
    type: String,
    default: () => new Date().toISOString().split("T")[0], // Default to current date
  },
  sonOf: {
    type: String,
  },
  resident: {
    type: String,
  },
  role: {
    type: String,
    enum: ["candidate", "admin"],
    default: "candidate",
  },
  status: {
    type: String,
    enum: ["pending", "reject", "approve"],
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model with type safety
const User = models.User || model<IUser>("User", userSchema);
export default User;
