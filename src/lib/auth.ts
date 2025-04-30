import jwt from "jsonwebtoken";
import { type NextRequest } from "next/server";

export function getUserFromCookie(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { id: string };
  } catch {
    return null;
  }
}
