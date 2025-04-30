"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import { fetchUsers, updateUserStatus, User } from "@/redux/userSlice";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function AllCandidates() {
  const dispatch = useDispatch<typeof store.dispatch>();
  const { users, loading } = useSelector((state: RootState) => state.users);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingApprove, setUpdatingApprove] = useState<{
    [id: string]: boolean;
  }>({});
  const [updatingReject, setUpdatingReject] = useState<{
    [id: string]: boolean;
  }>({});
  const itemsPerPage = 10;

  // Available months and years for filter
  const months = [
    { value: "all", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = [
    { value: "all", label: "All Years" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filtered = users
    .filter((u) => {
      // Validation: Check if all mandatory fields are filled
      const mandatoryFields = [u.name, u.aadhaarNo, u.phone, u.email];
      const isComplete = mandatoryFields.every(
        (field) => field && field.trim() !== ""
      );

      // If user has not filled all mandatory fields, filter them out
      if (!isComplete) return false;

      // Existing search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        u.name?.toLowerCase().includes(searchLower) ||
        false ||
        u.aadhaarNo?.includes(searchLower) ||
        false ||
        u.phone?.includes(searchLower) ||
        false ||
        u.email?.toLowerCase().includes(searchLower) ||
        false;

      const matchesStatus = statusFilter === "all" || u.status === statusFilter;

      // Parse currentDate (assuming it's in ISO format like "2023-04-15")
      const date = new Date(u.currentDate);
      const userMonth = date.getMonth() + 1; // getMonth() is 0-based
      const userYear = date.getFullYear();

      const matchesMonth =
        monthFilter === "all" || userMonth === parseInt(monthFilter);
      const matchesYear =
        yearFilter === "all" || userYear === parseInt(yearFilter);

      return matchesSearch && matchesStatus && matchesMonth && matchesYear;
    })
    .sort((a, b) =>
      a.status === "pending" && b.status !== "pending"
        ? -1
        : b.status === "pending" && a.status !== "pending"
        ? 1
        : 0
    );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pageData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusUpdate = async (
    id: string,
    status: "approve" | "reject"
  ) => {
    if (status === "approve") setUpdatingApprove((p) => ({ ...p, [id]: true }));
    else setUpdatingReject((p) => ({ ...p, [id]: true }));

    try {
      await dispatch(updateUserStatus({ id, status })).unwrap();
      toast.success(`User ${status}ed successfully`);
    } catch {
      toast.error("Status update failed");
    } finally {
      if (status === "approve")
        setUpdatingApprove((p) => ({ ...p, [id]: false }));
      else setUpdatingReject((p) => ({ ...p, [id]: false }));
    }
  };

  return (
    <div className="h-full p-6">
      <Card>
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input
              placeholder="Search by Name, Aadhaar, Phone, Email, or Exam Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/3"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-1/4">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
              </SelectContent>
            </Select>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-full sm:w-1/4">
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full sm:w-1/4">
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Aadhaar</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-4 text-gray-500"
                  >
                    <div className="flex justify-center items-center">
                      <ClipLoader size={24} color="#666" />
                      <span className="ml-2">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : pageData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-600 text-lg font-semibold"
                  >
                    No candidates found
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.aadhaarNo}</TableCell>
                    <TableCell>{u.phone}</TableCell>
                    <TableCell>{u.currentDate}</TableCell>
                    <TableCell
                      className={
                        u.status === "pending"
                          ? "text-yellow-500"
                          : u.status === "approve"
                          ? "text-green-500"
                          : "text-destructive"
                      }
                    >
                      {u.status}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/admin/users/user-submissions/viewform?id=${u.id}`
                            )
                          }
                        >
                          View
                        </Button>
                        {u.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() =>
                                handleStatusUpdate(u.id, "approve")
                              }
                              disabled={updatingApprove[u.id]}
                            >
                              {updatingApprove[u.id] ? (
                                <ClipLoader size={12} />
                              ) : (
                                "Approve"
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(u.id, "reject")}
                              disabled={updatingReject[u.id]}
                            >
                              {updatingReject[u.id] ? (
                                <ClipLoader size={12} />
                              ) : (
                                "Reject"
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
