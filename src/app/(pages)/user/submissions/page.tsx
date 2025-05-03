"use client";

// Humble imports
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Interface for submission data
interface SubmissionData {
  _id?: string;
  name: string;
  email: string;
  examCityPreference1: string;
  examCityPreference2: string;
  status: "pending" | "approve" | "reject";
  submittedAt?: string;
  [key: string]: any;
}

const Submission = () => {
  const router = useRouter();

  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = Cookies.get("token");

        if (!token) {
          toast.error("Please login to continue.");
          router.push("/login");
          return;
        }

        const response = await axios.get("/api/auth/signup", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data = Array.isArray(response.data)
          ? response.data
          : [response.data];

        data = data.map((item) => ({
          ...item,
          status: item.status || "pending",
          submittedAt: item.submittedAt || new Date().toISOString(),
        }));

        setSubmissions(data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          toast.error("Your session has expired. Please login again.");
          router.push("/login");
        } else {
          toast.error(
            err.response?.data?.message ||
              "Failed to fetch submissions. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approve":
        return "bg-green-500";
      case "reject":
        return "bg-red-500";
      case "pending":
      default:
        return "bg-yellow-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2">Please wait...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-800">
          My Submissions
        </h1>

        {submissions.length === 0 ? (
          <p className="text-center text-gray-600">No submissions found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {submissions.map((submission) => (
              <Card
                key={submission._id || submission.email}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-blue-700 flex items-center justify-between">
                    <span>
                      Submission #{submission._id?.slice(-6) || "N/A"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-3 w-3 rounded-full ${getStatusColor(
                          submission.status
                        )}`}
                      ></span>
                      <span>{submission.status}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Name:</strong> {submission.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {submission.email}
                  </p>
                  <p>
                    <strong>Exam City 1:</strong>{" "}
                    {submission.examCityPreference1}
                  </p>
                  <p>
                    <strong>Exam City 2:</strong>{" "}
                    {submission.examCityPreference2}
                  </p>
                  <p>
                    <strong>Submitted On:</strong>{" "}
                    {new Date(
                      submission.submittedAt || ""
                    ).toLocaleDateString()}
                  </p>
                  {/* Edit Button: Show only if status is Pending or Rejected */}
                  {submission.status === "pending" ||
                  submission.status === "reject" ? (
                    <Button
                      onClick={() => {
                        toast.info("Redirecting to edit submission...");
                        router.push(`/user/submissions/edit-submission`);
                      }}
                      className="mt-4 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md transition-transform transform hover:scale-105"
                    >
                      Edit Submission
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Button
            onClick={() => router.push("/")}
            className="bg-gray-600 text-white hover:bg-gray-700 px-8 py-3 rounded-full transition-transform transform hover:scale-105"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Submission;
