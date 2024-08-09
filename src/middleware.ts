import { NextResponse,NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/_next/') || pathname.startsWith('/static/')) {
      return NextResponse.next();
  }

  if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next();
  }

  if (pathname === '/login') {
      return NextResponse.next();
  }

  const adminToken = req.cookies.get("username");
  const userToken = req.cookies.get("__Secure-next-auth.session-token");

  if (!adminToken && !userToken) {
      console.log("No tokens found. Redirecting to login.");
      return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("Token found. Proceeding to next.");
  return NextResponse.next();   
}