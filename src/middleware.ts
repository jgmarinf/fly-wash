import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ["/auth/login", "/_next", "/favicon.ico", "/auth/new-account"];
const JWT_SECRET = process.env.JWT_SECRET;

function redirectToLogin(req: NextRequest, clearToken = false) {
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/auth/login";
  const response = NextResponse.redirect(loginUrl);
  // Elimina cookies inválidas (por ejemplo `token=undefined`) para evitar
  // un bucle de redirección que deja al usuario sin poder iniciar sesión.
  if (clearToken) {
    response.cookies.delete("token");
  }
  return response;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token || !JWT_SECRET) {
    return redirectToLogin(req);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return NextResponse.next();
  } catch  {
    return redirectToLogin(req, true);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
