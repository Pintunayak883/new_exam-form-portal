// Humble start: Declaring this as a client-side component
"use client";

// Humble imports: Bringing in the necessary tools
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

// Interface for profile data, covering all fields
interface ProfileData {
  name: string;
  email: string;
  dob: string;
  phone: string;
  area: string;
  landmark: string;
  address: string;
  examCityPreference1: string;
  examCityPreference2: string;
  previousCdaExperience: string;
  cdaExperienceYears: string;
  cdaExperienceRole: string;
  photo: File | null;
  signature: File | null;
  thumbprint: File | null;
  aadhaarNo: string;
  penaltyClauseAgreement: boolean;
  fever: string;
  cough: string;
  breathlessness: string;
  soreThroat: string;
  otherSymptoms: string;
  otherSymptomsDetails: string;
  closeContact: string;
  covidDeclarationAgreement: boolean;
  accountHolderName: string;
  bankName: string;
  ifsc: string;
  branch: string;
  bankAccountNo: string;
  currentDate: string;
  sonOf: string;
  resident: string;
  [key: string]: any;
}

const Profile = () => {
  // Humble state management: Initializing states
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editedData, setEditedData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Humble fetch: Getting user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        if (!token) {
          toast.warning("token not found please login first.");
          router.push("/login");
          return;
        }

        const response = await axios.get("/api/auth/signup", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        setProfileData(data);
        setEditedData(data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          toast.error("Session is over please login again.");
          router.push("/login");
        } else {
          toast.error(err.response?.data?.message || "Data is not found");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Humble toggle: Switching edit mode for a field
  const handleEditToggle = (field: string) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Humble change handler: Updating edited data
  const handleInputChange = (field: string, value: any) => {
    if (editedData) {
      setEditedData((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  // Humble save: Saving updated field to server
  const handleSave = async (field: string) => {
    if (editedData && profileData) {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.warning("Token is not found please login again.");
          router.push("/login");
          return;
        }

        const response = await axios.put(
          "/api/user",
          { [field]: editedData[field] },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfileData((prev) => ({
          ...prev!,
          [field]: editedData[field],
        }));
        setEditMode((prev) => ({ ...prev, [field]: false }));
        toast.success("Details update successfully.");
      } catch (err: any) {
        if (err.response?.status === 401) {
          toast.error("Session is over please login agin.");
          router.push("/login");
        } else {
          toast.error(err.response?.data?.message || "It's not Update");
        }
      }
    }
  };

  // Humble cancel: Reverting changes
  const handleCancel = (field: string) => {
    if (profileData) {
      setEditedData({ ...profileData });
      setEditMode((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Humble render: Loading or error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2">Please wait a moment data is loading.</p>
      </div>
    );
  }

  if (!profileData) {
    return toast.error("Profile is not found.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Dynamic header with user name */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-800 capitalize">
          {profileData.name ? `${profileData.name} ` : "User Profile"}
        </h1>

        {/* Personal Details Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { key: "name", label: "Full Name" },
              { key: "email", label: "Email" },
              { key: "dob", label: "Date of Birth", type: "date" },
              { key: "phone", label: "Phone" },
              { key: "area", label: "Area" },
              { key: "landmark", label: "Landmark" },
              { key: "address", label: "Address" },
              { key: "sonOf", label: "Son/Daughter Of" },
              { key: "resident", label: "Resident Of" },
            ].map((field) => (
              <div
                key={field.key}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <Label className="text-blue-600 w-full md:w-1/3 font-semibold">
                  {field.label}
                </Label>
                {editMode[field.key] ? (
                  <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-2">
                    <Input
                      type={field.type || "text"}
                      value={editedData?.[field.key] || ""}
                      onChange={(e) =>
                        handleInputChange(field.key, e.target.value)
                      }
                      className="border-blue-300 focus:border-blue-500 transition-colors"
                    />
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button
                        onClick={() => handleSave(field.key)}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCancel(field.key)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full md:w-2/3 flex justify-between items-center">
                    <span className="text-gray-700">
                      {profileData[field.key] || "N/A"}
                    </span>
                    <Button
                      onClick={() => handleEditToggle(field.key)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Exam Preferences Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">
              Exam Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { key: "examCityPreference1", label: "Exam City Preference 1" },
              { key: "examCityPreference2", label: "Exam City Preference 2" },
            ].map((field) => (
              <div
                key={field.key}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <Label className="text-blue-600 w-full md:w-1/3 font-semibold">
                  {field.label}
                </Label>
                {editMode[field.key] ? (
                  <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-2">
                    <Input
                      value={editedData?.[field.key] || ""}
                      onChange={(e) =>
                        handleInputChange(field.key, e.target.value)
                      }
                      className="border-blue-300 focus:border-blue-500 transition-colors"
                    />
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button
                        onClick={() => handleSave(field.key)}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCancel(field.key)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full md:w-2/3 flex justify-between items-center">
                    <span className="text-gray-700">
                      {profileData[field.key] || "N/A"}
                    </span>
                    <Button
                      onClick={() => handleEditToggle(field.key)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Experience Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                key: "previousCdaExperience",
                label: "Previous CDAC Experience",
              },
              { key: "cdaExperienceYears", label: "Years of Experience" },
              { key: "cdaExperienceRole", label: "Role in CDA" },
            ].map((field) => (
              <div
                key={field.key}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <Label className="text-blue-600 w-full md:w-1/3 font-semibold">
                  {field.label}
                </Label>
                {editMode[field.key] ? (
                  <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-2">
                    <Input
                      value={editedData?.[field.key] || ""}
                      onChange={(e) =>
                        handleInputChange(field.key, e.target.value)
                      }
                      className="border-blue-300 focus:border-blue-500 transition-colors"
                    />
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button
                        onClick={() => handleSave(field.key)}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCancel(field.key)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full md:w-2/3 flex justify-between items-center">
                    <span className="text-gray-700">
                      {profileData[field.key] || "N/A"}
                    </span>
                    <Button
                      onClick={() => handleEditToggle(field.key)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documents Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { key: "photo", label: "Photo" },
              { key: "signature", label: "Signature" },
              { key: "thumbprint", label: "Thumbprint" },
            ].map((field) => (
              <div
                key={field.key}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <Label className="text-blue-600 w-full md:w-1/3 font-semibold">
                  {field.label}
                </Label>
                {editMode[field.key] ? (
                  <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-2">
                    <Input
                      type="file"
                      onChange={(e) =>
                        handleInputChange(
                          field.key,
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                      className="border-blue-300 focus:border-blue-500 transition-colors"
                    />
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button
                        onClick={() => handleSave(field.key)}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCancel(field.key)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full md:w-2/3 flex justify-between items-center">
                    <span className="text-gray-700">
                      {profileData[field.key] ? "Uploaded" : "No file uploaded"}
                    </span>
                    <Button
                      onClick={() => handleEditToggle(field.key)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <Label className="text-blue-600 w-full md:w-1/3 font-semibold">
                Aadhaar No.
              </Label>
              {editMode["aadhaarNo"] ? (
                <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-2">
                  <Input
                    value={editedData?.aadhaarNo || ""}
                    onChange={(e) =>
                      handleInputChange("aadhaarNo", e.target.value)
                    }
                    className="border-blue-300 focus:border-blue-500 transition-colors"
                  />
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button
                      onClick={() => handleSave("aadhaarNo")}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => handleCancel("aadhaarNo")}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full md:w-2/3 flex justify-between items-center">
                  <span className="text-gray-700">
                    {profileData.aadhaarNo || "N/A"}
                  </span>
                  <Button
                    onClick={() => handleEditToggle("aadhaarNo")}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bank Details Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">
              Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { key: "accountHolderName", label: "Account Holder Name" },
              { key: "bankName", label: "Bank Name" },
              { key: "ifsc", label: "IFSC Code" },
              { key: "branch", label: "Branch" },
              { key: "bankAccountNo", label: "Bank Account No." },
            ].map((field) => (
              <div
                key={field.key}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <Label className="text-blue-600 w-full md:w-1/3 font-semibold">
                  {field.label}
                </Label>
                {editMode[field.key] ? (
                  <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-2">
                    <Input
                      value={editedData?.[field.key] || ""}
                      onChange={(e) =>
                        handleInputChange(field.key, e.target.value)
                      }
                      className="border-blue-300 focus:border-blue-500 transition-colors"
                    />
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button
                        onClick={() => handleSave(field.key)}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCancel(field.key)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full md:w-2/3 flex justify-between items-center">
                    <span className="text-gray-700">
                      {profileData[field.key] || "N/A"}
                    </span>
                    <Button
                      onClick={() => handleEditToggle(field.key)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Health Declaration Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">
              Health Declaration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { key: "fever", label: "Fever" },
              { key: "cough", label: "Cough" },
              { key: "breathlessness", label: "Breathlessness" },
              { key: "soreThroat", label: "Sore Throat" },
              { key: "otherSymptoms", label: "Other Symptoms" },
              { key: "otherSymptomsDetails", label: "Other Symptoms Details" },
              { key: "closeContact", label: "Close Contact with COVID Case" },
            ].map((field) => (
              <div
                key={field.key}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <Label className="text-blue-600 w-full md:w-1/3 font-semibold">
                  {field.label}
                </Label>
                {editMode[field.key] ? (
                  <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-2">
                    <Input
                      value={editedData?.[field.key] || ""}
                      onChange={(e) =>
                        handleInputChange(field.key, e.target.value)
                      }
                      className="border-blue-300 focus:border-blue-500 transition-colors"
                    />
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button
                        onClick={() => handleSave(field.key)}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCancel(field.key)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full md:w-2/3 flex justify-between items-center">
                    <span className="text-gray-700">
                      {profileData[field.key] || "N/A"}
                    </span>
                    <Button
                      onClick={() => handleEditToggle(field.key)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <Label className="text-blue-600 w-full md:w-1/3 font-semibold">
                COVID Declaration Agreement
              </Label>
              {editMode["covidDeclarationAgreement"] ? (
                <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-2">
                  <Input
                    type="checkbox"
                    checked={editedData?.covidDeclarationAgreement || false}
                    onChange={(e) =>
                      handleInputChange(
                        "covidDeclarationAgreement",
                        e.target.checked
                      )
                    }
                    className="border-blue-300 focus:border-blue-500 transition-colors"
                  />
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button
                      onClick={() => handleSave("covidDeclarationAgreement")}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => handleCancel("covidDeclarationAgreement")}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full md:w-2/3 flex justify-between items-center">
                  <span className="text-gray-700">
                    {profileData.covidDeclarationAgreement ? "Yes" : "No"}
                  </span>
                  <Button
                    onClick={() =>
                      handleEditToggle("covidDeclarationAgreement")
                    }
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    disabled
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Agreements Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">Agreements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <Label className="text-blue-600 w-full md:w-1/3 font-semibold">
                Penalty Clause Agreement
              </Label>
              {editMode["penaltyClauseAgreement"] ? (
                <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-2">
                  <Input
                    type="checkbox"
                    checked={editedData?.penaltyClauseAgreement || false}
                    onChange={(e) =>
                      handleInputChange(
                        "penaltyClauseAgreement",
                        e.target.checked
                      )
                    }
                    className="border-blue-300 focus:border-blue-500 transition-colors"
                  />
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button
                      onClick={() => handleSave("penaltyClauseAgreement")}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => handleCancel("penaltyClauseAgreement")}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full md:w-2/3 flex justify-between items-center">
                  <span className="text-gray-700">
                    {profileData.penaltyClauseAgreement ? "Yes" : "No"}
                  </span>
                  <Button
                    onClick={() => handleEditToggle("penaltyClauseAgreement")}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    disabled
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Humble export: Making the component available
export default Profile;
