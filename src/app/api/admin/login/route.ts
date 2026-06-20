import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminSessionToken,
  isAdminRequest,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: isAdminRequest(request) });
}
