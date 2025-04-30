import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  const getDetailsFromToken = (token: string | undefined) => {
    if (!token) return { role: null, status: null };
    try {
      const decoded: any = jwt.decode(token);
      return {
        role: decoded?.role || null,
        status: decoded?.status || null,
      };
    } catch (error) {
      return { role: null, status: null };
    }
  };

  const { role, status } = getDetailsFromToken(token);

  const publicRoutes = ["/login", "/register", "/about"];
  const protectedRoutes = ["/dashboard", "/profile", "/apply"];
  const candidateOnlyRoutes = ["/apply"];
  const submissionRoutes = ["/edit-submissions", "/submissions"];

  // Public Routes
  if (publicRoutes.some((route) => path.startsWith(route))) {
    if (token && role) {
      if (role == "candidate") {
        return NextResponse.redirect(new URL("/user/apply", req.url));
      }
      if (role == "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }
    return NextResponse.next();
  }

  // Admin Routes
  if (path.startsWith("/admin")) {
    if (!token || role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Candidate route protection based on status
  if (role === "candidate") {
    if (
      path === "/apply" &&
      ["pending", "accepted", "rejected"].includes(status)
    ) {
      return NextResponse.redirect(new URL("/submissions", req.url));
    }

    if (submissionRoutes.includes(path) && status === null) {
      return NextResponse.redirect(new URL("/apply", req.url));
    }
  }

  // General protected routes
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
