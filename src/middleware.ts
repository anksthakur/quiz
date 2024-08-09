import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies;
  const adminToken = cookies.get('authToken');
  const userToken = cookies.get('next-auth.session-token') || cookies.get('__Secure-next-auth.session-token');

  console.log('Admin Token:', adminToken);
console.log('User Token:', userToken);

  // Protect admin routes
  if (!adminToken && (pathname === '/admin' || pathname === '/adminquestions')) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  //Protect user routes
  // if (!userToken && pathname === '/user') {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // Admin is authenticated
  if (adminToken) {
    if (pathname === '/login') {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // User is authenticated
  if (userToken) {
    if (pathname === '/admin' || pathname === '/adminquestions' || pathname === '/login') {
      return NextResponse.redirect(new URL("/user", req.url));
    }
  }

  return NextResponse.next();
}
