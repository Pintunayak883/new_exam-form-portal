"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createForm, fetchFormData } from "@/redux/formSlice";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Form data type
interface FormData {
  examName: string;
  heldDate: string; // Format: Month YYYY (e.g., April 2025)
  startDate: Date | null;
  endDate: Date | null;
  examCount: string; // Stored as string in state, converted to number in payload
}

// API response type for fetchFormData
interface FormDataResponse {
  examName?: string;
  heldDate?: string;
  startDate?: string;
  endDate?: string;
  examCount?: number;
}

// Payload type for createForm
interface CreateFormPayload {
  examName: string;
  heldDate: string;
  startDate: string;
  endDate: string;
  examCount: number;
}

const Create_Form = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    examName: "",
    heldDate: "",
    startDate: null,
    endDate: null,
    examCount: "",
  });

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Months and years for held date
  const months: string[] = [
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
  const years: number[] = Array.from({ length: 10 }, (_, i) => 2025 + i);

  // Handle form input changes
  const handleInputChange = (
    field: keyof FormData,
    value: string | Date | null
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.examName.trim()) {
      toast.error("Exam name is required");
      return false;
    }
    if (!formData.heldDate) {
      toast.error("Held date is required");
      return false;
    }
    if (!formData.startDate) {
      toast.error("Start date is required");
      return false;
    }
    if (!formData.endDate) {
      toast.error("End date is required");
      return false;
    }
    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate >= formData.endDate
    ) {
      toast.error("End date must be after start date");
      return false;
    }
    if (
      !formData.examCount ||
      isNaN(Number(formData.examCount)) ||
      Number(formData.examCount) <= 0
    ) {
      toast.error("Valid exam count is required");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload: CreateFormPayload = {
        examName: formData.examName,
        heldDate: formData.heldDate,
        startDate: formData.startDate
          ? format(formData.startDate, "dd MMMM yyyy")
          : "",
        endDate: formData.endDate
          ? format(formData.endDate, "dd MMMM yyyy")
          : "",
        examCount: Number(formData.examCount),
      };

      await dispatch(createForm(payload)).unwrap();
      toast.success("Form created successfully");

      // Redirect to "myform" page after success
      router.push("/admin/myform");

      // Reset form
      setFormData({
        examName: "",
        heldDate: "",
        startDate: null,
        endDate: null,
        examCount: "",
      });
    } catch (error) {
      toast.error("Failed to create form");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch data on component mount
  const fetchdata = async (): Promise<void> => {
    try {
      const formDataFromAPI: FormDataResponse = await dispatch(
        fetchFormData()
      ).unwrap();
      if (formDataFromAPI) {
        setFormData({
          examName: formDataFromAPI.examName || "",
          heldDate: formDataFromAPI.heldDate || "",
          startDate: formDataFromAPI.startDate
            ? new Date(formDataFromAPI.startDate)
            : null,
          endDate: formDataFromAPI.endDate
            ? new Date(formDataFromAPI.endDate)
            : null,
          examCount: formDataFromAPI.examCount?.toString() || "",
        });
      }
    } catch (error) {
      toast.error("Failed to fetch form data");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, [dispatch]);

  // Handle held date change
  const handleHeldDateChange = (
    type: "month" | "year",
    value: string
  ): void => {
    const [currentMonth, currentYear] = formData.heldDate
      ? formData.heldDate.split(" ")
      : ["", ""];
    const newHeldDate: string =
      type === "month"
        ? `${value} ${currentYear || years[0]}`
        : `${currentMonth || months[0]} ${value}`;
    handleInputChange("heldDate", newHeldDate);
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Exam Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exam Name */}
            <div className="space-y-2">
              <Label htmlFor="examName">Exam Name</Label>
              <Input
                id="examName"
                value={formData.examName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("examName", e.target.value)
                }
                placeholder="Enter exam name"
                className="w-full"
              />
            </div>

            {/* Held Date */}
            <div className="space-y-2">
              <Label>Held Date (Month YYYY)</Label>
              <div className="flex gap-4">
                <Select
                  onValueChange={(value: string) =>
                    handleHeldDateChange("month", value)
                  }
                  value={formData.heldDate.split(" ")[0] || ""}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(value: string) =>
                    handleHeldDateChange("year", value)
                  }
                  value={formData.heldDate.split(" ")[1] || ""}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Exam Count */}
            <div className="space-y-2">
              <Label htmlFor="examCount">Exam Count</Label>
              <Input
                id="examCount"
                type="number"
                value={formData.examCount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("examCount", e.target.value)
                }
                placeholder="Enter number of exams"
                className="w-full"
                min="1"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date: Date | null) =>
                  handleInputChange("startDate", date)
                }
                className="w-full p-2 border"
                dateFormat="dd MMM yyyy"
                placeholderText="Select start date"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date: Date | null) =>
                  handleInputChange("endDate", date)
                }
                className="w-full p-2 border"
                dateFormat="dd MMM yyyy"
                placeholderText="Select end date"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create Form"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Create_Form;
