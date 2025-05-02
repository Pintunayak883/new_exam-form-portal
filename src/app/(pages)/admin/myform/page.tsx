"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchFormData } from "@/redux/formSlice";

// Define interface for form data
interface FormData {
  examName: string;
  heldDate: string;
  startDate: Date | null;
  endDate: Date | null;
  examCount: string;
}

const MyForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Initialize formData with proper types
  const [formData, setFormData] = useState<FormData>({
    examName: "",
    heldDate: "",
    startDate: null,
    endDate: null,
    examCount: "",
  });

  // Function to fetch data from API
  const fetchdata = async () => {
    try {
      const formDataFromAPI = await dispatch(fetchFormData()).unwrap();
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

  // Fetch data on component mount
  useEffect(() => {
    fetchdata();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white rounded-xl shadow-lg transition-transform hover:scale-105">
        <CardHeader className="bg-blue-600 text-white rounded-t-xl">
          <CardTitle className="text-2xl font-bold">
            Exam Form Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exam Name */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Exam Name
              </Label>
              <Input
                value={formData.examName}
                readOnly
                className="w-full bg-gray-100 border-none text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Held Date */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Held Date
              </Label>
              <Input
                value={formData.heldDate}
                readOnly
                className="w-full bg-gray-100 border-none text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Start Date
              </Label>
              <Input
                value={
                  formData.startDate
                    ? formData.startDate.toLocaleDateString()
                    : ""
                }
                readOnly
                className="w-full bg-gray-100 border-none text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                End Date
              </Label>
              <Input
                value={
                  formData.endDate ? formData.endDate.toLocaleDateString() : ""
                }
                readOnly
                className="w-full bg-gray-100 border-none text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Exam Count */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Exam Count
              </Label>
              <Input
                value={formData.examCount}
                readOnly
                className="w-full bg-gray-100 border-none text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyForm;
