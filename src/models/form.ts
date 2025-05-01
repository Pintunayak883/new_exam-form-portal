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
  examName: string;
  heldDate: string;
  startDate: string;
  endDate: string;
  examCount: number; // Changed to lowercase 'number' for consistency
  createdAt: Date;
}

const formSchema = new Schema<IForm>({
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

const Form: Model<IForm> =
  mongoose.models.Form || model<IForm>("Form", formSchema);

export default Form;
