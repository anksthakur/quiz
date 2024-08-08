import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies;
  const authToken = cookies.get('authToken');


  // Access a specific cookie
  const UserToken = cookies.get('next-auth.session-token');

  if (authToken) {
      if (pathname === '/user') {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else if (pathname === '/login'){
        return NextResponse.redirect(new URL("/admin", req.url));
      }

    } else if (UserToken){
      if (pathname === '/admin') {
        return NextResponse.redirect(new URL("/user", req.url));
      } else if (pathname === '/adminquestions'){
        return NextResponse.redirect(new URL("/user", req.url));
      } else if (pathname === '/login'){
        return NextResponse.redirect(new URL("/user", req.url));
      }
    }

    
    return NextResponse.next();


}