"use client";

// Humble imports for our Navbar
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

// Humble Redux imports for auth management
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import { RootState } from "@/redux/store";

export default function Navbar() {
  // Humble Redux hooks for dispatch and auth state
  const dispatch = useDispatch();
  const router = useRouter();

  // Humble auth state from Redux
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  // Humble logout handler
  const handleLogout = () => {
    dispatch(logout());
    setTimeout(() => {
      router.push("/login");
    }, 100);
  };

  return (
    <>
      <nav className="bg-blue-600 text-white shadow-full">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Humble logo as Home link */}
          <Link href="/" className="text-xl font-bold">
            Home
          </Link>

          {/* Humble account dropdown */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-blue-700"
                >
                  <User className="mr-2 h-5 w-5" />
                  <span>Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      {role === "admin" ? (
                        <Link href="/admin/dashboard">Dashboard</Link>
                      ) : (
                        <Link href="/user/profile">Profile</Link>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Guest</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/register">Register</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </>
  );
}
