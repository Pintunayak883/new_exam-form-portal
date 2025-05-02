import mongoose, { Schema, model, Model } from "mongoose";

// Month names for validation
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

interface IForm {
  key: string; // singleton key for ensuring single doc
  examName: string;
  heldDate: string;
  startDate: string;
  endDate: string;
  examCount: number;
  createdAt: Date;
}

const formSchema = new Schema<IForm>({
  key: {
    type: String,
    default: "singleton",
    unique: true, // ensures one document only
  },
  examName: {
    type: String,
    required: true,
    trim: true,
  },
  heldDate: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        const [month, year] = value.split(" ");
        return monthNames.includes(month) && /^\d{4}$/.test(year);
      },
      message:
        'Invalid heldDate format. Expected "Month YYYY" (e.g., "January 2026")',
    },
  },
  examCount: {
    type: Number,
    required: true,
    min: [1, "Exam count must be at least 1"],
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// humbly: don't re-register model if already exists
const Form: Model<IForm> =
  mongoose.models.Form || model<IForm>("Form", formSchema);

export default Form;
