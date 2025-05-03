"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (response.status === 200) {
        dispatch(
          loginSuccess({
            email: data.email,
            name: data.name,
            role: data.role,
          })
        );

        toast.success("Login successful!");

        if (data.role === "admin") {
          router.push("/admin/dashboard");
        } else if (data.role === "candidate") {
          router.push("/user/apply");
        } else {
          router.push("/");
        }
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const authData = Cookies.get("authData");
    if (token && authData) {
      try {
        const parsed = JSON.parse(authData);
        dispatch(loginSuccess(parsed));
      } catch (err) {
        console.error("Invalid authData cookie");
      }
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          Login to Exam Form Portal
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="border-blue-400 focus:border-blue-600 focus:ring-blue-600"
              required
            />
          </div>

          {/* Password Input with Eye Icon */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-blue-700 font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="border-blue-400 focus:border-blue-600 focus:ring-blue-600 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-blue-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-700 text-white hover:bg-blue-800 transition-all rounded-lg py-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex justify-center items-center gap-2">
                <ClipLoader size={20} color="#ffffff" />
                <span>Logging in...</span>
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-blue-700 font-medium">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-900 hover:underline font-bold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
