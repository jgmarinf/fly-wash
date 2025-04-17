import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ["/auth/login", "/_next", "/favicon.ico", "/auth/new-account"];
const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token || !JWT_SECRET) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return NextResponse.next();
  } catch  {

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
