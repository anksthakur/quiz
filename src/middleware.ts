import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies;
  const adminToken = cookies.get('authToken');
  const userToken = cookies.get('next-auth.session-token');

  // Protect admin routes
  if (!adminToken && (pathname === '/admin' || pathname === '/adminquestions')) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // // Protect user routes
  if (!userToken && pathname === '/user') {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // authenticated as admin
  if (adminToken) {
    if (pathname === '/user') {
      return NextResponse.redirect(new URL("/admin", req.url));
    } else if (pathname === '/login') {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // authenticated as user
  if (userToken) {
    if (pathname === '/admin' || pathname === '/adminquestions') {
      return NextResponse.redirect(new URL("/user", req.url));
    } else if (pathname === '/login') {
      return NextResponse.redirect(new URL("/user", req.url));
    }
  }

  return NextResponse.next();
}
