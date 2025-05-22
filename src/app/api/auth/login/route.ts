import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";


const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    if (email !== USER_EMAIL || password !== USER_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    if (!JWT_SECRET) {
      return NextResponse.json({ error: "JWT secret not configured." }, { status: 500 });
    }
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    const response = NextResponse.json({ success: true });
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      maxAge: 3600
    });
    return response;
  } catch  {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
