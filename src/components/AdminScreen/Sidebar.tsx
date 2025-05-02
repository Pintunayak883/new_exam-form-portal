"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  Home,
  FilePlus,
  Users,
  ClipboardX,
  Bell,
  History,
  Download,
  MoreVertical,
  ChevronDown,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/authSlice";
import { useState, useRef, useEffect } from "react";

export function AppSidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { name } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const [openFormDropdown, setOpenFormDropdown] = useState(false);
  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Ref for the three-dot dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Sidebar className="h-full bg-gray-100 border-r border-gray-200">
      <SidebarHeader>
        <h2 className="text-lg font-bold px-4 py-3 text-gray-800">
          Admin Panel
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-gray-500">
            Main
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={
                  pathname === "/admin/dashboard"
                    ? "bg-gray-200 text-primary font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }
              >
                <Link href="/admin/dashboard">
                  <Home size={20} />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setOpenFormDropdown(!openFormDropdown)}
                className={
                  pathname === "/admin/create-form" ||
                  pathname === "/admin/my-forms"
                    ? "bg-gray-200 text-primary font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }
              >
                <FilePlus size={20} />
                <span>Form</span>
                <ChevronDown
                  size={16}
                  className={`ml-auto transition-transform ${
                    openFormDropdown ? "rotate-180" : ""
                  }`}
                />
              </SidebarMenuButton>
              {openFormDropdown && (
                <div className="ml-8 mt-1 text-sm flex flex-col gap-1">
                  <Link
                    href="/admin/create-form"
                    className={
                      pathname === "/admin/create-form"
                        ? "text-primary font-semibold hover:underline"
                        : "text-gray-700 hover:underline"
                    }
                  >
                    Create Form
                  </Link>
                  <Link
                    href="/admin/myform"
                    className={
                      pathname === "/admin/myform"
                        ? "text-primary font-semibold hover:underline"
                        : "text-gray-700 hover:underline"
                    }
                  >
                    My Forms
                  </Link>
                </div>
              )}
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setOpenUserDropdown(!openUserDropdown)}
                className={
                  pathname === "/admin/user-list" ||
                  pathname === "/admin/user-submissions"
                    ? "bg-gray-200 text-primary font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }
              >
                <Users size={20} />
                <span>Users</span>
                <ChevronDown
                  size={16}
                  className={`ml-auto transition-transform ${
                    openUserDropdown ? "rotate-180" : ""
                  }`}
                />
              </SidebarMenuButton>
              {openUserDropdown && (
                <div className="ml-8 mt-1 text-sm flex flex-col gap-1">
                  <Link
                    href="/admin/users/user-list"
                    className={
                      pathname === "/admin/users/user-list"
                        ? "text-primary font-semibold hover:underline"
                        : "text-gray-700 hover:underline"
                    }
                  >
                    User List
                  </Link>
                  <Link
                    href="/admin/users/user-submissions"
                    className={
                      pathname === "/admin/user-submissions"
                        ? "text-primary font-semibold hover:underline"
                        : "text-gray-700 hover:underline"
                    }
                  >
                    User Submissions
                  </Link>
                </div>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-gray-500">
            Actions
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={
                  pathname === "/admin/mark-mistakes"
                    ? "bg-gray-200 text-primary font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }
              >
                <Link href="/admin/mark-mistakes">
                  <ClipboardX size={20} />
                  <span>Mark Mistakes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={
                  pathname === "/admin/notifications"
                    ? "bg-gray-200 text-primary font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }
              >
                <Link href="/admin/notifications">
                  <Bell size={20} />
                  <span>Send Notifications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={
                  pathname === "/admin/history"
                    ? "bg-gray-200 text-primary font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }
              >
                <Link href="/admin/history">
                  <History size={20} />
                  <span>User History</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={
                  pathname === "/admin/export"
                    ? "bg-gray-200 text-primary font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }
              >
                <Link href="/admin/export">
                  <Download size={20} />
                  <span>Export Data</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="relative w-full" ref={dropdownRef}>
          <div className="flex items-center justify-between px-2 py-2 text-sm">
            <div
              className="cursor-pointer hover:underline text-gray-700"
              onClick={() => router.push("/admin/profile")}
            >
              {name || "Admin"}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="p-1"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <MoreVertical size={18} />
            </Button>
          </div>

          {dropdownOpen && (
            <div className="absolute right-2 bottom-12 bg-white border rounded shadow-md w-36 z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
