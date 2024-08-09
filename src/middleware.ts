import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies;
  const adminToken = cookies.get("authToken");
  const userToken =
    cookies.get("next-auth.session-token")

  console.log("adminToken:", adminToken);
  console.log("userToken:", userToken);

  // Protect routes
  if (!adminToken && !userToken) {
    if (
      pathname === "/admin" ||
      pathname === "/adminquestions" ||
      pathname === "/user"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Admin is authenticated
  if (adminToken) {
    if (pathname === "/user" || pathname === "/login") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // User is authenticated
  if (userToken) {
    if (
      pathname === "/admin" ||
      pathname === "/adminquestions" ||
      pathname === "/login"
    ) {
      return NextResponse.redirect(new URL("/user", req.url));
    }
  }

  return NextResponse.next();
}
