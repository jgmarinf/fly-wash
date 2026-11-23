import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Diagnóstico de sesión: indica si la petición trae una cookie `token`
 * válida. Útil para comprobar desde un dispositivo si el navegador está
 * guardando/enviando la cookie correctamente.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false, reason: "missing-token-cookie" },
      { status: 401 }
    );
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json(
      { authenticated: false, reason: "server-misconfigured" },
      { status: 500 }
    );
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.json({ authenticated: true, email: payload.email });
  } catch {
    return NextResponse.json(
      { authenticated: false, reason: "invalid-token" },
      { status: 401 }
    );
  }
}
