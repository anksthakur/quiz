import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies;

  const authToken = cookies.get("authToken")?.value;
  const UserToken = cookies.get("next-auth.session-token");

  console.log("Requested Pathname:", pathname);
  console.log("Auth Token:", authToken);
  console.log("Session Token:", UserToken);
  
  // Allow access to static files and public routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/public/') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/) ||
    pathname === '/login' ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // admin is authenticated
  if (authToken) {
    // Restrict admin from accessing user routes
    if (pathname === '/user') {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (pathname === '/admin' || pathname === '/adminquestions' || pathname === '/') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // user is authenticated
  if (UserToken) {
    // Restrict user from accessing admin routes
    if (pathname === '/admin' || pathname === '/adminquestions') {
      return NextResponse.redirect(new URL("/user", req.url)); 
    }
    if (pathname === '/' || pathname === '/user') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!authToken && pathname !== '/login') {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
