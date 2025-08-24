import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request : NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.SECURE as any ?? false,
  });

  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  // Check the role and redirect based on the role
  switch (token.role) {
    case "ROLE_STUDENT":
      if (
        request.nextUrl.pathname.startsWith("/instructor") ||
        request.nextUrl.pathname.startsWith("/admin") ||
        request.nextUrl.pathname.startsWith("/register") ||
        request.nextUrl.pathname.startsWith("/login")
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      break;
    case "ROLE_INSTRUCTOR":
      // Add the paths that the owner can access here
      if (!request.nextUrl.pathname.startsWith("/instructor")) {
        return NextResponse.redirect(new URL("/instructor/dashboard", request.url));
      }
      break;
    case "ROLE_ADMIN":
      // Add the paths that the admin can access here
      if (!request.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      break;
    case null:
    case undefined:
      if (
        !(request.nextUrl.pathname == "/") &&
        !request.nextUrl.pathname.startsWith("/house-details")
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      break;
    default:
      return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    // Match all routes except the ones that start with /login and api and the static folder
    "/((?!api|_next/static|_next/image|images|image|favicon.ico|login|register).+)",
  ],
};
