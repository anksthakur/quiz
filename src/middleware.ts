import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies;

  // Extract the authToken from cookies
  const authToken = cookies.get("authToken")?.value;
  const UserToken = cookies.get("next-auth.session-token");
  // Log the details for debugging
  console.log("Requested Pathname:", pathname);
  console.log("Auth Token:", authToken);
  console.log("Session Token:", UserToken);
  console.log();
  
  // Allow access to static files
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

  // Check if the admin is authenticated
  if (authToken) {
    if (
      pathname === '/admin' ||
      pathname === '/adminquestions' ||
      pathname === '/user'
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  }
  //user
  if (UserToken) {
    console.log(pathname);
    
    if (
      pathname === '/' ||
      pathname === '/user'
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect to login page if no valid token is found 
  if (!authToken && pathname !== '/login') {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow the request if none of the conditions are met
  return NextResponse.next();
}
