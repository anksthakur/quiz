import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies;
  const adminToken = cookies.get("authToken");
  const userToken =
    cookies.get("next-auth.session-token") || cookies.get("__Secure-next-auth.session-token") 

  console.log("adminToken:", adminToken);
  console.log("userToken:", userToken);

if(pathname.startsWith("/api/auth/")){
return NextResponse.next();
}
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
    if (pathname === "/user") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // User is authenticated
  if (userToken) {
    if (
      pathname === "/admin" ||
      pathname === "/adminquestions"
    ) {
      return NextResponse.redirect(new URL("/user", req.url));
    }
  }

  return NextResponse.next();
}